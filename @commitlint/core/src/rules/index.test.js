import path from 'path';
import test from 'ava';
import globby from 'globby';
import {values} from 'lodash';
import rules from '.';

test('exports all rules', async t => {
	const expected = await glob('*.js');
	const actual = Object.keys(rules);
	t.deepEqual(actual, expected);
});

test('rules export functions', t => {
	const actual = values(rules);
	t.true(actual.every(rule => typeof rule === 'function'));
});

async function glob(pattern) {
	const files = await globby([path.join(__dirname, pattern)], {
		ignore: ['**/index.js', '**/*.test.js'],
		cwd: __dirname
	});
	return files.map(relative).map(toExport);
}

function relative(filePath) {
	return path.relative(__dirname, filePath);
}

function toExport(fileName) {
	return path.basename(fileName, path.extname(fileName));
}
