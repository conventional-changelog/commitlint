const Repository = require('lerna/lib/Repository');

module.exports = {
	utils: {getPackages},
	rules: {
		'scope-enum': () => [2, 'always', getPackages()]
	}
};

function getPackages() {
	const repo = new Repository(process.cwd());
	return repo.packages
		.map(pkg => pkg.name)
		.map(name => (name.charAt(0) === '@' ? name.split('/')[1] : name));
}
