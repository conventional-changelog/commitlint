import path from 'node:path';
import fs from 'node:fs/promises';
import fg from 'fast-glob';
import configWorkspaceScopes from '@commitlint/config-workspace-scopes';

export default {
	utils: {getProjects},
	rules: {
		'scope-enum': (ctx) =>
			getProjects(ctx).then((packages) => [2, 'always', packages]),
	},
};

/**
 * Turn glob paths with potential 'package.json' ending always into paths
 * with a package.json ending to find monorepo packages
 * @param {string[]} patterns
 * @returns A list of glob paths to resolve package.json files
 */
function normalizePatterns(patterns) {
	const normalizedPatterns = [];
	for (const pattern of patterns) {
		normalizedPatterns.push(pattern.replace(/\/?$/, '/package.json'));
	}
	return normalizedPatterns;
}

/**
 * Find all package.json contents in the defined cwd
 * @param {string} cwd
 * @returns A list of parsed package.json files as objects
 */
async function findPackages(cwd) {
	const json = await fs.readFile(path.join(cwd, 'lerna.json'), {
		encoding: 'utf-8',
	});

	const packages = JSON.parse(json)?.packages || [];
	if (packages.length === 0) {
		return [];
	}

	const patterns = normalizePatterns(packages);
	const entries = await fg(patterns, {
		cwd,
		ignore: ['**/node_modules/**', '**/bower_components/**'],
	});

	const pkgJsons = await Promise.all(
		Array.from(new Set(entries.map((entry) => path.join(cwd, entry)))).map(
			(pkgPath) => fs.readFile(pkgPath, {encoding: 'utf-8'})
		)
	);

	return pkgJsons.map((pkgJson) => JSON.parse(pkgJson) || {});
}

async function getProjects(context) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	// try to read workspaces for backwards compatibility
	const workspacePackages = await configWorkspaceScopes.utils.getPackages({
		cwd,
	});
	// native npm/yarn workspaces detected, inform user to use new package instead
	if (workspacePackages.length > 0) {
		console.warn(
			[
				`It seems that you are using npm/yarn workspaces instead of lernas "packages" declaration.`,
				`Support for workspaces will be removed in a future major version of this package.`,
				`Please make sure to transition to "@commitlint/config-workspace-scopes" in the near future.`,
			].join('\n')
		);
		return workspacePackages;
	}

	const packages = await findPackages(cwd);

	return packages
		.reduce((pkgNames, pkg) => {
			const name = pkg.name;
			if (name) {
				pkgNames.push(name.charAt(0) === '@' ? name.split('/')[1] : name);
			}
			return pkgNames;
		}, [])
		.sort();
}
