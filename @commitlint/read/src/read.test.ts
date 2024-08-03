import {test, expect} from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import {git} from '@commitlint/test';
import {execa} from 'execa';

import read from './read.js';

test('get edit commit message specified by the `edit` flag', async () => {
	const cwd: string = await git.bootstrap();

	await fs.writeFile(path.join(cwd, 'commit-msg-file'), 'foo');

	const expected = ['foo\n'];
	const actual = await read({edit: 'commit-msg-file', cwd});
	expect(actual).toEqual(expected);
});

test('get edit commit message from git root', async () => {
	const cwd: string = await git.bootstrap();

	await fs.writeFile(path.join(cwd, 'alpha.txt'), 'alpha');
	await execa('git', ['add', '.'], {cwd});
	await execa('git', ['commit', '-m', 'alpha'], {cwd});
	const expected = ['alpha\n\n'];
	const actual = await read({edit: true, cwd});
	expect(actual).toEqual(expected);
});

test('get history commit messages', async () => {
	const cwd: string = await git.bootstrap();
	await fs.writeFile(path.join(cwd, 'alpha.txt'), 'alpha');
	await execa('git', ['add', 'alpha.txt'], {cwd});
	await execa('git', ['commit', '-m', 'alpha'], {cwd});
	await execa('git', ['rm', 'alpha.txt'], {cwd});
	await execa('git', ['commit', '-m', 'remove alpha'], {cwd});

	const expected = ['remove alpha\n\n', 'alpha\n\n'];
	const actual = await read({cwd});
	expect(actual).toEqual(expected);
});

test('get edit commit message from git subdirectory', async () => {
	const cwd: string = await git.bootstrap();
	await fs.mkdir(path.join(cwd, 'beta'));
	await fs.writeFile(path.join(cwd, 'beta/beta.txt'), 'beta');

	await execa('git', ['add', '.'], {cwd});
	await execa('git', ['commit', '-m', 'beta'], {cwd});

	const expected = ['beta\n\n'];
	const actual = await read({edit: true, cwd});
	expect(actual).toEqual(expected);
});

test('get edit commit message while skipping first commit', async () => {
	const cwd: string = await git.bootstrap();
	await fs.mkdir(path.join(cwd, 'beta'));
	await fs.writeFile(path.join(cwd, 'beta/beta.txt'), 'beta');

	await fs.writeFile(path.join(cwd, 'alpha.txt'), 'alpha');
	await execa('git', ['add', 'alpha.txt'], {cwd});
	await execa('git', ['commit', '-m', 'alpha'], {cwd});
	await fs.writeFile(path.join(cwd, 'beta.txt'), 'beta');
	await execa('git', ['add', 'beta.txt'], {cwd});
	await execa('git', ['commit', '-m', 'beta'], {cwd});
	await fs.writeFile(path.join(cwd, 'gamma.txt'), 'gamma');
	await execa('git', ['add', 'gamma.txt'], {cwd});
	await execa('git', ['commit', '-m', 'gamma'], {cwd});

	const expected = ['beta\n\n'];
	const actual = await read({from: 'HEAD~2', cwd, gitLogArgs: '--skip 1'});
	expect(actual).toEqual(expected);
});

test('should only read the last commit', async () => {
	const cwd: string = await git.bootstrap();

	await execa('git', ['commit', '--allow-empty', '-m', 'commit Z'], {cwd});
	await execa('git', ['commit', '--allow-empty', '-m', 'commit Y'], {cwd});
	await execa('git', ['commit', '--allow-empty', '-m', 'commit X'], {cwd});

	const result = await read({cwd, last: true});

	expect(result).toEqual(['commit X']);
});

test('should read commits from the last annotated tag', async () => {
	const cwd: string = await git.bootstrap();

	await execa(
		'git',
		['commit', '--allow-empty', '-m', 'chore: release v1.0.0'],
		{cwd}
	);
	await execa('git', ['tag', 'v1.0.0', '--annotate', '-m', 'v1.0.0'], {cwd});
	await execa('git', ['commit', '--allow-empty', '-m', 'commit 1'], {cwd});
	await execa('git', ['commit', '--allow-empty', '-m', 'commit 2'], {cwd});

	const result = await read({cwd, fromLastTag: true});

	expect(result).toEqual(['commit 2\n\n', 'commit 1\n\n']);
});

test('should read commits from the last lightweight tag', async () => {
	const cwd: string = await git.bootstrap();

	await execa(
		'git',
		['commit', '--allow-empty', '-m', 'chore: release v9.9.9-alpha.1'],
		{cwd}
	);
	await execa('git', ['tag', 'v9.9.9-alpha.1'], {cwd});
	await execa('git', ['commit', '--allow-empty', '-m', 'commit A'], {cwd});
	await execa('git', ['commit', '--allow-empty', '-m', 'commit B'], {cwd});

	const result = await read({cwd, fromLastTag: true});

	expect(result).toEqual(['commit B\n\n', 'commit A\n\n']);
});

test('should not read any commits when there are no tags', async () => {
	const cwd: string = await git.bootstrap();

	await execa('git', ['commit', '--allow-empty', '-m', 'commit 7'], {cwd});
	await execa('git', ['commit', '--allow-empty', '-m', 'commit 8'], {cwd});
	await execa('git', ['commit', '--allow-empty', '-m', 'commit 9'], {cwd});

	const result = await read({cwd, fromLastTag: true});

	expect(result).toHaveLength(0);
});
