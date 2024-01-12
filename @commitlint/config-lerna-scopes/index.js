import {createRequire} from 'module';
import Path from 'path';
import {pathToFileURL} from 'url';

import glob from 'glob';
import importFrom from 'import-from';
import semver from 'semver';

const require = createRequire(import.meta.url);

export default {
	utils: {getPackages},
	rules: {
		'scope-enum': (ctx) =>
			getPackages(ctx).then((packages) => [2, 'always', packages]),
	},
};

function getPackages(context) {
	return Promise.resolve()
		.then(() => {
			const ctx = context || {};
			const cwd = ctx.cwd || process.cwd();

			const {workspaces} = require(Path.join(cwd, 'package.json'));
			if (Array.isArray(workspaces) && workspaces.length) {
				// use yarn workspaces

				const wsGlobs = workspaces.flatMap((ws) => {
					const path = Path.posix.join(ws, 'package.json');
					return glob.sync(path, {cwd, ignore: ['**/node_modules/**']});
				});

				return wsGlobs.map((pJson) => require(Path.join(cwd, pJson)));
			}

			const lernaVersion = getLernaVersion(cwd);
			if (semver.lt(lernaVersion, '3.0.0')) {
				const Repository = importFrom(cwd, 'lerna/lib/Repository');
				const PackageUtilities = importFrom(cwd, 'lerna/lib/PackageUtilities');

				const repository = new Repository(cwd);
				return PackageUtilities.getPackages({
					packageConfigs: repository.packageConfigs,
					rootPath: cwd,
				});
			}

			const {getPackages} = importFrom(cwd, '@lerna/project');
			return getPackages(cwd);
		})
		.then((packages) => {
			return packages
				.map((pkg) => pkg.name)
				.filter(Boolean)
				.map((name) => (name.charAt(0) === '@' ? name.split('/')[1] : name));
		});
}

function getLernaVersion(cwd) {
	const moduleEntrypoint = require.resolve('lerna', {
		paths: [cwd],
	});
	const moduleDir = Path.join(
		moduleEntrypoint.slice(0, moduleEntrypoint.lastIndexOf('node_modules')),
		'node_modules',
		'lerna'
	);
	const modulePackageJson = Path.join(moduleDir, 'package.json');
	return require(modulePackageJson).version;
}
