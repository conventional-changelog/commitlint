import {git} from '@commitlint/test';
import test from 'ava';
import execa from 'execa';
import * as sander from '@marionebl/sander';

import read from './read';

test('get edit commit message specified by the `edit` flag', async t => {
	const cwd = await git.bootstrap();

	await sander.writeFile(cwd, 'commit-msg-file', 'foo');

	const expected = ['foo\n'];
	const actual = await read({edit: 'commit-msg-file', cwd});
	t.deepEqual(actual, expected);
});

test('get edit commit message from git root', async t => {
	const cwd = await git.bootstrap();

	await sander.writeFile(cwd, 'alpha.txt', 'alpha');
	await execa('git', ['add', '.'], {cwd});
	await execa('git', ['commit', '-m', 'alpha'], {cwd});
	const expected = ['alpha\n\n'];
	const actual = await read({edit: true, cwd});
	t.deepEqual(actual, expected);
});

test('get history commit messages', async t => {
	const cwd = await git.bootstrap();
	await sander.writeFile(cwd, 'alpha.txt', 'alpha');
	await execa('git', ['add', 'alpha.txt'], {cwd});
	await execa('git', ['commit', '-m', 'alpha'], {cwd});
	await execa('git', ['rm', 'alpha.txt'], {cwd});
	await execa('git', ['commit', '-m', 'remove alpha'], {cwd});

	const expected = ['remove alpha\n\n', 'alpha\n\n'];
	const actual = await read({cwd});
	t.deepEqual(actual, expected);
});

test('get edit commit message from git subdirectory', async t => {
	const cwd = await git.bootstrap();
	await sander.mkdir(cwd, 'beta');
	await sander.writeFile(cwd, 'beta/beta.txt', 'beta');

	await execa('git', ['add', '.'], {cwd});
	await execa('git', ['commit', '-m', 'beta'], {cwd});

	const expected = ['beta\n\n'];
	const actual = await read({edit: true, cwd});
	t.deepEqual(actual, expected);
});
