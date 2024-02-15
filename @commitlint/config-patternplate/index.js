import path from 'path';

import configAngular from '@commitlint/config-angular';
import {glob} from 'glob';
import merge from 'lodash.merge';

function pathToId(root, filePath) {
	const relativePath = path.relative(root, filePath);
	return path.dirname(relativePath).split(path.sep).join('/');
}

async function getPatternIDs() {
	const root = path.resolve(process.cwd(), './patterns');
	const pattern = path.resolve(root, '**/pattern.json');
	const files = glob(pattern);
	return files.map((result) => pathToId(root, result));
}

export default merge(configAngular, {
	rules: {
		'scope-enum': () =>
			getPatternIDs().then((ids) => [2, 'always', ids.concat(['system'])]),
	},
});
