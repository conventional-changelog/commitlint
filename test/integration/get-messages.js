import {tmpdir} from 'os';
import crypto from 'crypto';
import {join} from 'path';

import test from 'ava';
import denodeify from 'denodeify';
import execa from 'execa';
import {writeFile} from 'mz/fs';
import exists from 'path-exists';
import rimraf from 'rimraf';
import expect from 'unexpected';

import getMessages from '../../source/library/get-messages';

const rm = denodeify(rimraf);

test.serial('get edit commit message from git root', async () => {
	const repo = await initRepository();

	await writeFile('alpha.txt', 'alpha');
	await execa('git', ['add', '.']);
	await execa('git', ['commit', '-m', 'alpha']);

	const expected = ['alpha\n\n'];
	const actual = await getMessages({edit: true});
	expect(actual, 'to equal', expected);

	await cleanRepository(repo);
});

test.serial('get history commit messages', async () => {
	const repo = await initRepository();

	await writeFile('alpha.txt', 'alpha');
	await execa('git', ['add', 'alpha.txt']);
	await execa('git', ['commit', '-m', 'alpha']);
	await execa('git', ['rm', 'alpha.txt']);
	await execa('git', ['commit', '-m', 'remove alpha']);

	const expected = ['remove alpha\n\n', 'alpha\n\n'];
	const actual = await getMessages({});
	expect(actual, 'to equal', expected);

	await cleanRepository(repo);
});

async function initRepository() {
	const previous = process.cwd();
	const directory = join(tmpdir(), rand());
	await execa('git', ['init', directory]);
	process.chdir(directory);
	return {directory, previous};
}

async function cleanRepository(repo) {
	if (await exists(repo.directory)) {
		await rm(repo.directory);
	}
	process.chdir(repo.previous);
}

function rand() {
	return crypto.randomBytes(Math.ceil(6)).toString('hex').slice(0, 12);
}
