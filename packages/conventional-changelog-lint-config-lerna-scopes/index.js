const path = require('path');
const globby = require('globby');
const jsonfile = require('load-json-file');

module.exports = {
	utils: {
		getPackages: getPackages
	},
	rules: {
		'scope-enum': () => getPackages()
			.then(names => [2, 'always', names])
	}
};

function getPackages() {
	const root = path.resolve(process.cwd(), './packages');
	const glob = path.resolve(root, '*/package.json');

	return globby(glob)
		.then(paths => Promise.all(paths.map(jsonfile)))
		.then(manifests => manifests.map(manifest => manifest.name));
}
