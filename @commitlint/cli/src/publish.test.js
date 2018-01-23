import {npm} from '@commitlint/test';
import test from 'ava';

test('should publish the minimum files', async t => {
	await npm.testPackingFiles(t, [
		'CHANGELOG.md',
		'README.md',
		'index.js',
		'lib/cli.js',
		'lib/cli.js.map',
		'lib/help.js',
		'lib/help.js.map',
		'package.json'
	]);
});
