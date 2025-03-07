import {SpawnOptions} from 'node:child_process';

import {createRequire} from 'node:module';

import {x} from 'tinyexec';

const require = createRequire(import.meta.url);

// Allow to override used bins for testing purposes
const GIT = process.env.TRAVIS_COMMITLINT_GIT_BIN || 'git';
const COMMITLINT =
	process.env.TRAVIS_COMMITLINT_BIN || require('@commitlint/cli');

const REQUIRED = [
	'TRAVIS_COMMIT',
	'TRAVIS_COMMIT_RANGE',
	'TRAVIS_EVENT_TYPE',
	'TRAVIS_REPO_SLUG',
	'TRAVIS_PULL_REQUEST_SLUG',
];

const COMMIT = process.env.TRAVIS_COMMIT || '';
const REPO_SLUG = process.env.TRAVIS_REPO_SLUG;
const PR_SLUG = process.env.TRAVIS_PULL_REQUEST_SLUG || REPO_SLUG;
const RANGE = process.env.TRAVIS_COMMIT_RANGE;
const IS_PR = process.env.TRAVIS_EVENT_TYPE === 'pull_request';

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

async function main() {
	validate();

	// Stash changes in working copy if needed
	const pop = await stash();

	// Make base and source available as dedicated remotes
	await Promise.all([
		() => fetch({name: 'base', url: `https://github.com/${REPO_SLUG}.git`}),
		IS_PR
			? () => fetch({name: 'source', url: `https://github.com/${PR_SLUG}.git`})
			: () => Promise.resolve(),
	]);

	// Restore stashed changes if any
	await pop();

	const args = process.argv.slice(2);

	// Lint all commits in TRAVIS_COMMIT_RANGE if available
	if (IS_PR && RANGE) {
		const [start, end] = RANGE.split('.').filter(Boolean);
		await lint(['--from', start, '--to', end, ...args]);
	} else {
		const input = await log(COMMIT);
		await lint(args, {}, input);
	}
}

async function git(args: string[], nodeOptions: SpawnOptions = {}) {
	return x(GIT, args, {
		nodeOptions: {
			stdio: 'inherit',
			...nodeOptions,
		},
	});
}

async function fetch({name, url}: {name: string; url: string}) {
	await git(['remote', 'add', name, url]);
	await git(['fetch', name, '--quiet']);
}

async function isClean() {
	const result = await git(['status', '--porcelain'], {
		stdio: ['pipe', 'pipe', 'pipe'],
	});
	return !(result.stdout && result.stdout.trim());
}

async function lint(
	args: string[],
	nodeOptions: SpawnOptions = {},
	input: string = '',
) {
	const result = x(COMMITLINT, args, {
		nodeOptions: {
			stdio: ['pipe', 'inherit', 'inherit'],
			...nodeOptions,
		},
	});

	result.process?.stdin?.write(input);
	result.process?.stdin?.end();

	return result;
}

async function log(hash: string) {
	const result = await git(['log', '-n', '1', '--pretty=format:%B', hash], {
		stdio: 'pipe',
	});
	return result.stdout;
}

async function stash() {
	if (await isClean()) {
		return () => Promise.resolve();
	}
	await git(['stash', '-k', '-u', '--quiet']);
	return () => git(['stash', 'pop', '--quiet']);
}

function validate() {
	if (process.env.CI !== 'true' || process.env.TRAVIS !== 'true') {
		throw new Error(
			`@commitlint/travis-cli is intended to be used on Travis CI`,
		);
	}

	const missing = REQUIRED.filter((envVar) => !(envVar in process.env));

	if (missing.length > 0) {
		const stanza = missing.length > 1 ? 'they were not' : 'it was not';
		throw new Error(
			`Expected ${missing.join(', ')} to be defined globally, ${stanza}.`,
		);
	}
}
