import path from 'path';

import fg from 'fast-glob';
import readYamlFile from 'read-yaml-file';
import {readExactProjectManifest} from '@pnpm/read-project-manifest';

export default {
	utils: {getProjects},
	rules: {
		'scope-enum': (ctx) =>
			getProjects(ctx).then((packages) => [2, 'always', packages]),
	},
};

function requirePackagesManifest(dir) {
	return readYamlFile(path.join(dir, 'pnpm-workspace.yaml')).catch((err) => {
		if (err.code === 'ENOENT') {
			return null;
		}

		throw err;
	});
}

function normalizePatterns(patterns) {
	const normalizedPatterns = [];
	for (const pattern of patterns) {
		normalizedPatterns.push(pattern.replace(/\/?$/, '/package.json'));
		normalizedPatterns.push(pattern.replace(/\/?$/, '/package.json5'));
		normalizedPatterns.push(pattern.replace(/\/?$/, '/package.yaml'));
	}
	return normalizedPatterns;
}

function findWorkspacePackages(cwd) {
	return requirePackagesManifest(cwd)
		.then((manifest) => {
			const patterns = normalizePatterns(
				(manifest && manifest.packages) || ['**']
			);
			const opts = {
				cwd,
				ignore: ['**/node_modules/**', '**/bower_components/**'],
			};

			return fg(patterns, opts);
		})
		.then((entries) => {
			const paths = Array.from(
				new Set(entries.map((entry) => path.join(cwd, entry)))
			);

			return Promise.all(
				paths.map((manifestPath) => readExactProjectManifest(manifestPath))
			);
		})
		.then((manifests) => {
			return manifests.map((manifest) => manifest.manifest);
		});
}

function getProjects(context) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	return findWorkspacePackages(cwd).then((projects) => {
		return projects
			.reduce((projects, project) => {
				const name = project.name;

				if (name) {
					projects.push(name.charAt(0) === '@' ? name.split('/')[1] : name);
				}

				return projects;
			}, [])
			.sort();
	});
}
