const Path = require('path');
const importFrom = require('import-from');
const resolvePkg = require('resolve-pkg');
const Globby = require('globby');
const semver = require('semver');

module.exports = {
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
				return Globby(
					workspaces.map((ws) => {
						return Path.posix.join(ws, 'package.json');
					}),
					{cwd}
				).then((pJsons = []) => {
					return pJsons.map((pJson) => require(Path.join(cwd, pJson)));
				});
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
	return require(Path.join(resolvePkg('lerna', {cwd}), 'package.json')).version;
}
