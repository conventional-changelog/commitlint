const path = require('path');
const fs = require('fs');
const globby = require('globby');
const merge = require('lodash').merge;

function pathToId(root, filePath) {
	const relativePath = path.relative(root, filePath);
	return path
		.dirname(relativePath)
		.split(path.sep)
		.join('/');
}

function getPatternIDs() {
	const patternsJSON = path.resolve(
		process.cwd(),
		'./.commitlint-patterns.json'
	);

	if (fs.existsSync(patternsJSON)) {
		try {
			const patterns = JSON.parse(fs.readFileSync(patternsJSON, 'utf-8'));
			return Promise.resolve(patterns.patterns);
		} catch (err) {
			console.log('There was an error processing .commitlint-patterns.json');
			console.log('Falling back to directory patterns');
		}
	}

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
