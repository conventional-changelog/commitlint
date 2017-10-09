const importFrom = require('import-from');

module.exports = {
	utils: {getPackages},
	rules: {
		'scope-enum': ctx => [2, 'always', getPackages(ctx)]
	}
};

function getPackages(context) {
	const ctx = context || {};
	const cwd = ctx.cwd || process.cwd();

	const Repository = importFrom(cwd, 'lerna/lib/Repository');
	const PackageUtilities = importFrom(cwd, 'lerna/lib/PackageUtilities');

	const repository = new Repository(cwd);
	const packages = PackageUtilities.getPackages({
		packageConfigs: repository.packageConfigs,
		rootPath: cwd
	});

	return packages
		.map(pkg => pkg.name)
		.map(name => (name.charAt(0) === '@' ? name.split('/')[1] : name));
}
