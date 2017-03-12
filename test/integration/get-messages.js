import {tmpdir} from 'os';
import crypto from 'crypto';
import {join} from 'path';

import test from 'ava';
import denodeify from 'denodeify';
import execa from 'execa';
import {mkdir, writeFile} from 'mz/fs';
import exists from 'path-exists';
import rimraf from 'rimraf';
import expect from 'unexpected';

import getMessages from '../../source/library/get-messages';
import pkg from '../../package';

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

test.serial('get edit commit message from git subdirectory', async () => {
	const repo = await initRepository();

	await mkdir('beta');
	await writeFile('beta/beta.txt', 'beta');
	process.chdir('beta');
	await execa('git', ['add', '.']);
	await execa('git', ['commit', '-m', 'beta']);

	const expected = ['beta\n\n'];
	const actual = await getMessages({edit: true});
	expect(actual, 'to equal', expected);

	await cleanRepository(repo);
});

test.serial('get history commit messages from shallow clone', async () => {
	const repo = await initRepository();

	await writeFile('alpha.txt', 'alpha');
	await execa('git', ['add', 'alpha.txt']);
	await execa('git', ['commit', '-m', 'alpha']);

	const clone = await cloneRepository(pkg.repository.url, repo, '--depth', '1');

	const actual = async () => await getMessages({from: 'master'});
	expect(actual, 'to error with', /Could not get git history from shallow clone/);

	await cleanRepository(clone);
	await cleanRepository(repo);
});

async function initRepository() {
	const previous = process.cwd();
	const directory = join(tmpdir(), rand());

	await execa('git', ['init', directory]);

	process.chdir(directory);

	await execa('git', ['config', 'user.email', 'test@example.com']);
	await execa('git', ['config', 'user.name', 'ava']);

	return {directory, previous};
}

async function cloneRepository(source, context, ...args) {
	const directory = join(tmpdir(), rand());
	await execa('git', ['clone', ...args, source, directory]);
	process.chdir(directory);

	await execa('git', ['config', 'user.email', 'test@example.com']);
	await execa('git', ['config', 'user.name', 'ava']);

	return {directory, previous: context.previous};
}

async function cleanRepository(repo) {
	process.chdir(repo.previous);

	if (await exists(repo.directory)) {
		await rm(repo.directory);
	}
}

function rand() {
	return crypto.randomBytes(Math.ceil(6)).toString('hex').slice(0, 12);
}
