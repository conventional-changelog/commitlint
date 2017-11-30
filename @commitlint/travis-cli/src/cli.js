#!/usr/bin/env node
const execa = require('execa');
const commitlint = require('@commitlint/cli');

// Allow to override used bins for testing purposes
const GIT = process.env.TRAVIS_COMMITLINT_GIT_BIN || 'git';
const COMMITLINT = process.env.TRAVIS_COMMITLINT_BIN;

const REQUIRED = [
	'TRAVIS_COMMIT',
	'TRAVIS_COMMIT_RANGE',
	'TRAVIS_REPO_SLUG',
	'TRAVIS_PULL_REQUEST_SLUG'
];

const COMMIT = process.env.TRAVIS_COMMIT;
const REPO_SLUG = process.env.TRAVIS_REPO_SLUG;
const PR_SLUG = process.env.TRAVIS_PULL_REQUEST_SLUG || REPO_SLUG;
const RANGE = process.env.TRAVIS_COMMIT_RANGE;

main().catch(err => {
	console.log(err);
	process.exit(1);
});

async function main() {
	validate();

	// Stash changes in working copy if needed
	const pop = await stash();

	// Make base and source available as dedicated remotes
	await Promise.all([
		() => fetch({name: 'base', url: `https://github.com/${REPO_SLUG}.git`}),
		() => fetch({name: 'source', url: `https://github.com/${PR_SLUG}.git`})
	]);

	// Restore stashed changes if any
	await pop();

	// Lint all commits in TRAVIS_COMMIT_RANGE if available
	if (RANGE) {
		const [start, end] = RANGE.split('.').filter(Boolean);
		await lint(['--from', start, '--to', end]);
	}

	// Always lint the triggering commit indicated by TRAVIS_COMMIT
	await lint(['--from', COMMIT]);
}

async function git(args, options) {
	return execa(GIT, args, Object.assign({}, {stdio: 'inherit'}, options));
}

async function fetch({name, url}) {
	await git(['remote', 'add', name, url]);
	await git(['fetch', name, '--quiet']);
}

async function isClean() {
	const result = await git(['status', '--porcelain'], {
		stdio: ['pipe', 'pipe', 'pipe']
	});
	return !(result.stdout && result.stdout.trim());
}

async function lint(args, options) {
	return execa(
		COMMITLINT || commitlint,
		args,
		Object.assign({}, {stdio: 'inherit'}, options)
	);
}

async function stash() {
	if (await isClean()) {
		return async () => {};
	}
	await git(['stash', '-k', '-u', '--quiet']);
	return () => git(['stash', 'pop', '--quiet']);
}

function validate() {
	if (process.env.CI !== 'true' || process.env.TRAVIS !== 'true') {
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
}
