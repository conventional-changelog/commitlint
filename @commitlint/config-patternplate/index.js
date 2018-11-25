const path = require('path');
const globby = require('globby');
const {merge} = require('lodash');

function pathToId(root, filePath) {
	const relativePath = path.relative(root, filePath);
	return path
		.dirname(relativePath)
		.split(path.sep)
		.join('/');
}

function getPatternIDs() {
	const root = path.resolve(process.cwd(), './patterns');
	const glob = path.resolve(root, '**/pattern.json');
	return globby(glob).then(results =>
		results.map(result => pathToId(root, result))
	);
}

module.exports = merge(require('@commitlint/config-angular'), {
	rules: {
		'scope-enum': () =>
			getPatternIDs().then(ids => [2, 'always', ids.concat(['system'])])
	}
});
