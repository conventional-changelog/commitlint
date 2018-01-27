import pkgDir from 'pkg-dir';
import {npm} from '@commitlint/test';
import test from 'ava';

test('should publish required files', async t => {
	const cwd = await pkgDir(__dirname);
	const actual = await npm.getTarballFiles({cwd});
	const expected = await npm.getPackageFiles({cwd, npmignore: true});
	t.deepEqual(actual, expected);
});
