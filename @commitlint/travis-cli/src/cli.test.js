// Disable ftb
// const os = require('os');
// const {git} = require('@commitlint/test');
const test = require('ava');
const execa = require('execa');
// Disable ftb
// const which = require('which');

// Disable ftb
// const NODE_BIN = which.sync('node');
const BIN = require.resolve('../lib/cli.js');

// Disable ftb
// const TRAVIS_COMMITLINT_BIN = require.resolve('../fixtures/commitlint');
// const TRAVIS_COMMITLINT_GIT_BIN = require.resolve('../fixtures/git');
// const TRAVIS_BRANCH = 'TRAVIS_BRANCH';
// const TRAVIS_COMMIT = 'TRAVIS_COMMIT';

const bin = async (config = {}) => {
	try {
		return await execa(BIN, Object.assign({extendEnv: false}, config));
	} catch (err) {
		throw new Error([err.stdout, err.stderr].join('\n'));
	}
};

test('should throw when not on travis ci', async t => {
	const env = {
		CI: false,
		TRAVIS: false
	};

	await t.throws(
		bin({env}),
		/@commitlint\/travis-cli is intended to be used on Travis CI/
	);
});

/* Test.failing(
	'should throw when on travis ci, but env vars are missing',
	async t => {
		const env = {
			TRAVIS: true,
			CI: true
		};

		await t.throws(bin({env}), /TRAVIS_COMMIT, TRAVIS_BRANCH/);
	}
); */

test('should throw when on travis ci, but TRAVIS_COMMIT is missing', async t => {
	const env = {
		TRAVIS: true,
		CI: true
	};

	await t.throws(bin({env}), /TRAVIS_COMMIT/);
});

/* Test.failing(
	'should throw when on travis ci, but TRAVIS_BRANCH is missing',
	async t => {
		const env = {
			TRAVIS: true,
			CI: true
		};

		await t.throws(bin({env}), /TRAVIS_BRANCH/);
	}
);

test.failing('should call git with expected args on shallow repo', async t => {
	if (os.platform() === 'win32') {
		t.pass();
		return;
	}

	const cwd = await git.clone('https://github.com/conventional-changelog/commitlint.git', [
		'--depth=10'
	]);

	const env = {
		TRAVIS: true,
		CI: true,
		TRAVIS_BRANCH,
		TRAVIS_COMMIT,
		TRAVIS_COMMITLINT_BIN,
		TRAVIS_COMMITLINT_GIT_BIN
	};

	const result = await bin({cwd, env});
	const invocations = await getInvocations(result.stdout);
	t.is(invocations.length, 7);

	const [
		stash,
		branches,
		unshallow,
		checkout,
		back,
		pop,
		commilint
	] = invocations;

	t.deepEqual(stash, [NODE_BIN, TRAVIS_COMMITLINT_GIT_BIN, 'stash']);
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
		'--unshallow',
		'--quiet'
	]);
	t.deepEqual(checkout, [
		NODE_BIN,
		TRAVIS_COMMITLINT_GIT_BIN,
		'checkout',
		TRAVIS_BRANCH,
		'--quiet'
	]);
	t.deepEqual(back, [
		NODE_BIN,
		TRAVIS_COMMITLINT_GIT_BIN,
		'checkout',
		'-',
		'--quiet'
	]);
	t.deepEqual(pop, [NODE_BIN, TRAVIS_COMMITLINT_GIT_BIN, 'stash', 'pop']);
	t.deepEqual(commilint, [
		NODE_BIN,
		TRAVIS_COMMITLINT_BIN,
		'--from',
		TRAVIS_BRANCH,
		'--to',
		TRAVIS_COMMIT
	]);
});

test.failing(
	'should call git with expected args on unshallow repo',
	async t => {
		if (os.platform() === 'win32') {
			t.pass();
			return;
		}

		const cwd = await git.clone('https://github.com/conventional-changelog/commitlint.git');

		const env = {
			TRAVIS: true,
			CI: true,
			TRAVIS_BRANCH,
			TRAVIS_COMMIT,
			TRAVIS_COMMITLINT_BIN,
			TRAVIS_COMMITLINT_GIT_BIN
		};

		const result = await bin({cwd, env});
		const invocations = await getInvocations(result.stdout);
		t.is(invocations.length, 6);

		const [stash, branches, checkout, back, pop, commilint] = invocations;

		t.deepEqual(stash, [NODE_BIN, TRAVIS_COMMITLINT_GIT_BIN, 'stash']);
		t.deepEqual(branches, [
			NODE_BIN,
			TRAVIS_COMMITLINT_GIT_BIN,
			'remote',
			'set-branches',
			'origin',
			TRAVIS_BRANCH
		]);
		t.deepEqual(checkout, [
			NODE_BIN,
			TRAVIS_COMMITLINT_GIT_BIN,
			'checkout',
			TRAVIS_BRANCH,
			'--quiet'
		]);
		t.deepEqual(back, [
			NODE_BIN,
			TRAVIS_COMMITLINT_GIT_BIN,
			'checkout',
			'-',
			'--quiet'
		]);
		t.deepEqual(pop, [NODE_BIN, TRAVIS_COMMITLINT_GIT_BIN, 'stash', 'pop']);
		t.deepEqual(commilint, [
			NODE_BIN,
			TRAVIS_COMMITLINT_BIN,
			'--from',
			TRAVIS_BRANCH,
			'--to',
			TRAVIS_COMMIT
		]);
	}
);

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
*/
