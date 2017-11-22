#!/usr/bin/env node
const path = require('path');
const execa = require('execa');
const isTravis = require('is-travis');

const REQUIRED = ['TRAVIS_COMMIT', 'TRAVIS_BRANCH'];

main().catch(err => {
	console.log({err});
	setTimeout(() => {
		console.log({err});
		throw err;
	}, 0);
});

function main() {
	return new Promise((resolve, reject) => {
		if (!isTravis) {
			return reject(
				new Error(`@commitlint/travis-cli is inteded of usage on Travis CI`)
			);
		}

		const missing = REQUIRED.filter(envVar => !(envVar in process.env));

		if (missing.length > 0) {
			const stanza = missing.length > 1 ? 'they were not' : 'it was not';
			return reject(
				new Error(
					`Expected ${missing.join(', ')} to be defined globally, ${stanza}.`
				)
			);
		}

		return execa('git', ['remote', 'set-branches', 'origin', 'master'])
			.then(() => execa('git', ['fetch', '--unshallow']))
			.then(() => execa('git', ['checkout', 'master']))
			.then(() => execa('git', ['checkout', '-']))
			.then(() => {
				return execa('npm', ['bin']).then(result => {
					const bin = result.stdout.split('\n')[0];
					return execa(path.join(bin, 'commitlint'), [
						'--from',
						process.env.TRAVIS_BRANCH,
						'--to',
						process.env.TRAVIS_COMMIT
					]);
				});
			});
	});
}
