const test = require('ava');
const execa = require('execa');
const which = require('which');

const NODE_BIN = which.sync('node');
const BIN = require.resolve('./cli.js');

const TRAVIS_COMMITLINT_BIN = require.resolve('./fixtures/commitlint');
const TRAVIS_COMMITLINT_GIT_BIN = require.resolve('./fixtures/git');
const TRAVIS_BRANCH = 'TRAVIS_BRANCH';
const TRAVIS_COMMIT = 'TRAVIS_COMMIT';

const bin = async (env = {}) => {
	try {
		return await execa(BIN, {env, extendEnv: false});
	} catch (err) {
		throw new Error([err.stdout, err.stderr].join('\n'));
	}
};

test('should throw when not on travis ci', async t => {
	await t.throws(
		bin(),
		/@commitlint\/travis-cli is inteded of usage on Travis CI/
	);
});

test('should throw when on travis ci, but env vars are missing', async t => {
	const env = {
		TRAVIS: true,
		CI: true
	};

	await t.throws(bin(env), /TRAVIS_COMMIT, TRAVIS_BRANCH/);
});

test('should throw when on travis ci, but TRAVIS_COMMIT is missing', async t => {
	const env = {
		TRAVIS: true,
		CI: true
	};

	await t.throws(bin(env), /TRAVIS_COMMIT/);
});

test('should throw when on travis ci, but TRAVIS_BRANCH is missing', async t => {
	const env = {
		TRAVIS: true,
		CI: true
	};

	await t.throws(bin(env), /TRAVIS_BRANCH/);
});

test('should call git with expected args if requirements are fulfilled', async t => {
	const env = {
		TRAVIS: true,
		CI: true,
		TRAVIS_BRANCH,
		TRAVIS_COMMIT,
		TRAVIS_COMMITLINT_BIN,
		TRAVIS_COMMITLINT_GIT_BIN
	};

	const result = await bin(env);
	const invocations = await getInvocations(result.stdout);
	t.is(invocations.length, 5);

	const [branches, unshallow, checkout, back, commilint] = invocations;

	t.deepEqual(branches, [
		NODE_BIN,
		TRAVIS_COMMITLINT_GIT_BIN,
		'remote',
		'set-branches',
		'origin',
		TRAVIS_BRANCH
	]);
	t.deepEqual(unshallow, [
		NODE_BIN,
		TRAVIS_COMMITLINT_GIT_BIN,
		'fetch',
		'--unshallow'
	]);
	t.deepEqual(checkout, [
		NODE_BIN,
		TRAVIS_COMMITLINT_GIT_BIN,
		'checkout',
		TRAVIS_BRANCH
	]);
	t.deepEqual(back, [NODE_BIN, TRAVIS_COMMITLINT_GIT_BIN, 'checkout', '-']);
	t.deepEqual(commilint, [
		NODE_BIN,
		TRAVIS_COMMITLINT_BIN,
		'--from',
		TRAVIS_BRANCH,
		'--to',
		TRAVIS_COMMIT
	]);
});

function getInvocations(stdout) {
	const matches = stdout.match(/[^[\]]+/g);
	const raw = Array.isArray(matches) ? matches : [];

	return raw.filter(invocation => invocation !== '\n').map(invocation =>
		invocation
			.split(',')
			.map(fragment => fragment.trim())
			.map(fragment => fragment.substring(1, fragment.length - 1))
			.filter(Boolean)
	);
}
