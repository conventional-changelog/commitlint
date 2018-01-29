import pkgDir from 'pkg-dir';
import {npm} from '@commitlint/test';
import test from 'ava';
import expect from 'unexpected';

test('should publish required files', async () => {
	const cwd = await pkgDir(__dirname);

	const actual = await npm.getTarballFiles(cwd);
	const expected = await npm.getPackageFiles(cwd);

	expect(actual, 'to contain', ...expected.bin);
	expect(actual, 'to contain', expected.main);

	expect(actual, 'to have items satisfying', item => {
		expect(item, 'not to end with', '.test.js');
	});
});

test('should not publish test files', async () => {
	const cwd = await pkgDir(__dirname);
	const actual = await npm.getTarballFiles(cwd);

	expect(actual, 'to have items satisfying', item => {
		expect(item, 'not to end with', '.test.js');
	});
});
