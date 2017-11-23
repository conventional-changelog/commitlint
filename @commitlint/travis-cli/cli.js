#!/usr/bin/env node
const execa = require('execa');
const isTravis = require('is-travis');

// Allow to override used bins for testing purposes
const GIT = process.env.TRAVIS_COMMITLINT_GIT_BIN || 'git';
const COMMITLINT =
	process.env.TRAVIS_COMMITLINT_BIN || require('@commitlint/cli'); // eslint-disable-line import/newline-after-import
const REQUIRED = ['TRAVIS_COMMIT', 'TRAVIS_BRANCH'];

main().catch(err => {
	console.log(err);
	process.exit(1);
});

function main() {
	if (!isTravis) {
		return Promise.reject(
			new Error(`@commitlint/travis-cli is inteded of usage on Travis CI`)
		);
	}

	const missing = REQUIRED.filter(envVar => !(envVar in process.env));

	if (missing.length > 0) {
		const stanza = missing.length > 1 ? 'they were not' : 'it was not';
		return Promise.reject(
			new Error(
				`Expected ${missing.join(', ')} to be defined globally, ${stanza}.`
			)
		);
	}

	return execa(
		GIT,
		['remote', 'set-branches', 'origin', process.env.TRAVIS_BRANCH],
		{stdio: 'inherit'}
	)
		.then(() => execa(GIT, ['fetch', '--unshallow'], {stdio: 'inherit'}))
		.then(() =>
			execa(GIT, ['checkout', process.env.TRAVIS_BRANCH], {stdio: 'inherit'})
		)
		.then(() => execa(GIT, ['checkout', '-'], {stdio: 'inherit'}))
		.then(() =>
			execa(
				COMMITLINT,
				[
					'--from',
					process.env.TRAVIS_BRANCH,
					'--to',
					process.env.TRAVIS_COMMIT
				],
				{stdio: 'inherit'}
			)
		);
}
