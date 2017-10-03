import {tmpdir} from 'os';
import crypto from 'crypto';
import {join} from 'path';

import test from 'ava';
import execa from 'execa';
import exists from 'path-exists';
import * as sander from '@marionebl/sander';

import pkg from '../package';
import read from './read';

test.beforeEach(async t => {
	t.context.repos = [await initRepository()];
});

test.afterEach.always(async t => {
	try {
		await Promise.all(t.context.repos.map(async repo => cleanRepository(repo)));
		t.context.repos = [];
	} catch (err) {
		console.log({err});
	}
});

test.serial('get edit commit message from git root', async t => {
	await sander.writeFile('alpha.txt', 'alpha');
	await execa('git', ['add', '.']);
	await execa('git', ['commit', '-m', 'alpha']);
	const expected = ['alpha\n\n'];
	const actual = await read({edit: true});
	t.deepEqual(actual, expected);
});

test.serial('get history commit messages', async t => {
	await sander.writeFile('alpha.txt', 'alpha');
	await execa('git', ['add', 'alpha.txt']);
	await execa('git', ['commit', '-m', 'alpha']);
	await execa('git', ['rm', 'alpha.txt']);
	await execa('git', ['commit', '-m', 'remove alpha']);

	const expected = ['remove alpha\n\n', 'alpha\n\n'];
	const actual = await read({});
	t.deepEqual(actual, expected);
});

test.serial('get edit commit message from git subdirectory', async t => {
	await sander.mkdir('beta');
	await sander.writeFile('beta/beta.txt', 'beta');
	process.chdir('beta');
	await execa('git', ['add', '.']);
	await execa('git', ['commit', '-m', 'beta']);

	const expected = ['beta\n\n'];
	const actual = await read({edit: true});
	t.deepEqual(actual, expected);
});

test.serial('get history commit messages from shallow clone', async t => {
	const [repo] = t.context.repos;

	await sander.writeFile('alpha.txt', 'alpha');
	await execa('git', ['add', 'alpha.txt']);
	await execa('git', ['commit', '-m', 'alpha']);

	const clone = await cloneRepository(pkg.repository.url, repo, '--depth', '1');
	t.context.repos = [...t.context.repos, clone];

	const err = await t.throws(read({from: 'master'}));
	t.true(
		err.message.indexOf('Could not get git history from shallow clone') > -1
	);
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
	if (repo.previous && repo.previous !== process.cwd()) {
		process.chdir(repo.previous);
	}

	if (await exists(repo.directory)) {
		await sander.rimraf(repo.directory);
	}
}

function rand() {
	return crypto
		.randomBytes(Math.ceil(6))
		.toString('hex')
		.slice(0, 12);
}
