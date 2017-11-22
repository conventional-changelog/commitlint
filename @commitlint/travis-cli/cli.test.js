const test = require('ava');
const execa = require('execa');

const BIN = require.resolve('./cli.js');

const bin = async (env = {}) => {
	try {
		return await execa(BIN, {env, extendEnv: false});
	} catch (err) {
		throw new Error([err.stdout, err.stderr].join('\n'));
	}
};

test('should throw when not on travis ci', t => {
	t.throws(bin(), /@commitlint\/travis-cli is inteded of usage on Travis CI/);
});

test('should throw when on travis ci, but env vars are missing', t => {
	const env = {
		TRAVIS: true,
		CI: true
	};

	t.throws(bin(env), /TRAVIS_COMMIT, TRAVIS_BRANCH/);
});

test('should throw when on travis ci, but TRAVIS_COMMIT is missing', t => {
	const env = {
		TRAVIS: true,
		CI: true
	};

	t.throws(bin(env), /TRAVIS_COMMIT/);
});

test('should throw when on travis ci, but TRAVIS_BRANCH is missing', t => {
	const env = {
		TRAVIS: true,
		CI: true
	};

	t.throws(bin(env), /TRAVIS_BRANCH/);
});
