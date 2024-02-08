const glob = require('glob');
const path = require('path');
const merge = require('lodash/merge');

function pathToId(root, filePath) {
	const relativePath = path.relative(root, filePath);
	return path.dirname(relativePath).split(path.sep).join('/');
}

function getPatternIDs() {
	const root = path.resolve(process.cwd(), './patterns');
	const pattern = path.resolve(root, '**/pattern.json');
	return glob.sync(pattern).map((result) => pathToId(root, result));
}

module.exports = merge(require('@commitlint/config-angular'), {
	rules: {
		'scope-enum': () =>
			getPatternIDs().then((ids) => [2, 'always', ids.concat(['system'])]),
	},
});
