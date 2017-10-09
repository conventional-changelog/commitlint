const Repository = require('lerna/lib/Repository');
const PackageUtilities = require('lerna/lib/PackageUtilities');

module.exports = {
	utils: {getPackages},
	rules: {
		'scope-enum': () => [2, 'always', getPackages()]
	}
};

function getPackages() {
	const cwd = process.cwd();
	const repository = new Repository(cwd);
	return PackageUtilities.getPackages({
		packageConfigs: repository.packageConfigs,
		rootPath: cwd
	})
		.map(pkg => pkg.name)
		.map(name => (name.charAt(0) === '@' ? name.split('/')[1] : name));
}
