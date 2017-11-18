import test from 'ava';
import execa from 'execa';
import {fix} from '@commitlint/test';
import * as sander from '@marionebl/sander';
import resolveExtends from './resolve-extends';

const id = id => id;

test('returns empty object when called without params', t => {
	const actual = resolveExtends();
	t.deepEqual(actual, {});
});

test('returns an equivalent object as passed in', t => {
	const expected = {foo: 'bar'};
	const actual = resolveExtends(expected);
	t.deepEqual(actual, expected);
});

test.serial('falls back to global install', async t => {
	const prev = process.env.PREFIX;

	const cwd = await fix.bootstrap('fixtures/global-install');
	const prefix = `${cwd}/commitlint-npm-packages`;

	const npm = args => execa('npm', args, {cwd});

	await sander.mkdir(cwd, 'commitlint-npm-packages');

	process.env.PREFIX = prefix;

	await npm([
		'install',
		'--global',
		'@commitlint/config-angular',
		'--prefix',
		prefix
	]);

	const expected = {extends: ['@commitlint/config-angular']};
	t.notThrows(() => resolveExtends(expected));

	process.env.PREFIX = prev;
});

test.serial('fails for missing extends', async t => {
	const prev = process.env.PREFIX;

	const cwd = await fix.bootstrap('fixtures/missing-install');
	const prefix = `${cwd}/commitlint-npm-packages`;

	process.env.PREFIX = prefix;

	const input = {extends: ['@commitlint/foo-bar']};

	t.throws(
		() => resolveExtends(input, {cwd}),
		/Cannot find module "@commitlint\/foo-bar" from/
	);

	process.env.PREFIX = prev;
});

test('uses empty prefix by default', t => {
	const input = {extends: ['extender-name']};

	resolveExtends(input, {
		resolve: id,
		require(id) {
			t.is(id, 'extender-name');
		}
	});
});

test('uses prefix as configured', t => {
	const input = {extends: ['extender-name']};

	resolveExtends(input, {
		prefix: 'prefix',
		resolve: id,
		require(id) {
			t.is(id, 'prefix-extender-name');
		}
	});
});

test('ignores prefix for scoped extends', t => {
	const input = {extends: ['@scope/extender-name']};

	resolveExtends(input, {
		prefix: 'prefix',
		resolve: id,
		require(id) {
			t.is(id, '@scope/extender-name');
		}
	});
});

test('ignores prefix for relative extends', t => {
	const input = {extends: ['./extender']};

	resolveExtends(input, {
		prefix: 'prefix',
		resolve: id,
		require(id) {
			t.is(id, './extender');
		}
	});
});

test('propagates return value of require function', t => {
	const input = {extends: ['extender-name']};
	const propagated = {foo: 'bar'};

	const actual = resolveExtends(input, {
		resolve: id,
		require() {
			return propagated;
		}
	});

	t.is(actual.foo, 'bar');
});

test('resolves extends recursively', t => {
	const input = {extends: ['extender-name']};
	const actual = [];

	resolveExtends(input, {
		resolve: id,
		require(id) {
			actual.push(id);
			if (id === 'extender-name') {
				return {extends: ['recursive-extender-name']};
			}
			if (id === 'recursive-extender-name') {
				return {foo: 'bar'};
			}
		}
	});

	t.deepEqual(actual, ['extender-name', 'recursive-extender-name']);
});

test('uses prefix key recursively', t => {
	const input = {extends: ['extender-name']};
	const actual = [];

	resolveExtends(input, {
		prefix: 'prefix',
		resolve: id,
		require(id) {
			actual.push(id);
			if (id === 'prefix-extender-name') {
				return {extends: ['recursive-extender-name']};
			}
			if (id === 'prefix-recursive-extender-name') {
				return {foo: 'bar'};
			}
		}
	});

	t.deepEqual(actual, [
		'prefix-extender-name',
		'prefix-recursive-extender-name'
	]);
});

test('propagates contents recursively', t => {
	const input = {extends: ['extender-name']};

	const actual = resolveExtends(input, {
		resolve: id,
		require(id) {
			if (id === 'extender-name') {
				return {extends: ['recursive-extender-name'], foo: 'bar'};
			}
			if (id === 'recursive-extender-name') {
				return {baz: 'bar'};
			}
		}
	});

	const expected = {
		extends: ['extender-name'],
		foo: 'bar',
		baz: 'bar'
	};

	t.deepEqual(actual, expected);
});

test('extending contents should take precedence', t => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const actual = resolveExtends(input, {
		resolve: id,
		require(id) {
			if (id === 'extender-name') {
				return {extends: ['recursive-extender-name'], zero: id, one: id};
			}
			if (id === 'recursive-extender-name') {
				return {
					extends: ['second-recursive-extender-name'],
					zero: id,
					one: id,
					two: id
				};
			}
			if (id === 'second-recursive-extender-name') {
				return {zero: id, one: id, two: id, three: id};
			}
		}
	});

	const expected = {
		extends: ['extender-name'],
		zero: 'root',
		one: 'extender-name',
		two: 'recursive-extender-name',
		three: 'second-recursive-extender-name'
	};

	t.deepEqual(actual, expected);
});

test('should fall back to conventional-changelog-lint-config prefix', t => {
	const input = {extends: ['extender-name']};

	const actual = resolveExtends(input, {
		prefix: 'prefix',
		resolve(id) {
			if (id === 'conventional-changelog-lint-config-extender-name') {
				return 'conventional-changelog-lint-config-extender-name';
			}
			throw new Error(`Could not find module "*${id}"`);
		},
		require(id) {
			if (id === 'conventional-changelog-lint-config-extender-name') {
				return {
					rules: {
						fallback: true
					}
				};
			}
		}
	});

	t.deepEqual(actual, {
		extends: ['extender-name'],
		rules: {
			fallback: true
		}
	});
});
