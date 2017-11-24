#!/usr/bin/env node
const execa = require('execa');
const isTravis = require('is-travis');

// Allow to override used bins for testing purposes
const GIT = process.env.TRAVIS_COMMITLINT_GIT_BIN || 'git';
const COMMITLINT =
	process.env.TRAVIS_COMMITLINT_BIN || require('@commitlint/cli'); // eslint-disable-line import/newline-after-import
const REQUIRED = ['TRAVIS_COMMIT', 'TRAVIS_BRANCH'];

const TRAVIS_BRANCH = process.env.TRAVIS_BRANCH;
const TRAVIS_COMMIT = process.env.TRAVIS_COMMIT;

main().catch(err => {
	console.log(err);
	process.exit(1);
});

async function main() {
	if (!isTravis) {
		throw new Error(
			`@commitlint/travis-cli is inteded to be used on Travis CI`
		);
	}

	const missing = REQUIRED.filter(envVar => !(envVar in process.env));

	if (missing.length > 0) {
		const stanza = missing.length > 1 ? 'they were not' : 'it was not';
		throw new Error(
			`Expected ${missing.join(', ')} to be defined globally, ${stanza}.`
		);
	}

	const pop = await stash();

	await git(['remote', 'set-branches', 'origin', TRAVIS_BRANCH]);
	await git(['fetch', '--unshallow', '--quiet']);
	await git(['checkout', TRAVIS_BRANCH, '--quiet']);
	await git(['checkout', '-', '--quiet']);

	await pop();

	await lint(['--from', TRAVIS_BRANCH, '--to', TRAVIS_COMMIT]);
}

async function git(args, options) {
	return execa(GIT, args, Object.assign({}, {stdio: 'inherit'}, options));
}

async function isClean() {
	const result = await git(['status', '--porcelain'], {
		stdio: ['pipe', 'pipe', 'pipe']
	});
	return !(result.stdout && result.stdout.trim());
}

async function lint(args, options) {
	return execa(
		COMMITLINT,
		args,
		Object.assign({}, {stdio: 'inherit'}, options)
	);
}

async function stash() {
	if (await isClean()) {
		return async () => {};
	}
	await git(['stash']);
	return () => git(['stash', 'pop']);
}
