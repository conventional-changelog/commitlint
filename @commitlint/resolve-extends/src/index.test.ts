import execa from 'execa';
import resolveExtends from '.';

const {fix} = require('@commitlint/test');
const sander = require('@marionebl/sander');

const id = (id: unknown) => id;

test('returns empty object when called without params', () => {
	const actual = resolveExtends();
	expect(actual).toEqual({});
});

test('returns an equivalent object as passed in', () => {
	const expected = {foo: 'bar'};
	const actual = resolveExtends(expected);
	expect(actual).toEqual(expected);
});

test('falls back to global install', async () => {
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

	expect(() => resolveExtends(expected)).not.toThrow();
	process.env.PREFIX = prev;
});

test('fails for missing extends', async () => {
	const prev = process.env.PREFIX;

	const cwd = await fix.bootstrap('fixtures/missing-install');
	const prefix = `${cwd}/commitlint-npm-packages`;

	process.env.PREFIX = prefix;

	const input = {extends: ['@commitlint/foo-bar']};

	expect(() => resolveExtends(input, {cwd})).toThrow(/Cannot find module "@commitlint\/foo-bar" from/);

	process.env.PREFIX = prev;
});

test('uses empty prefix by default', () => {
	const input = {extends: ['extender-name']};

	resolveExtends(input, {
		resolve: id,
		require(id) {
			expect(id).toBe('extender-name')
		}
	});
});

test('uses prefix as configured', t => {
	const input = {extends: ['extender-name']};

	resolveExtends(input, {
		prefix: 'prefix',
		resolve: id,
		require(id) {
			expect(id).toBe('prefix-extender-name')
		}
	});
});

test('ignores prefix for scoped extends', t => {
	const input = {extends: ['@scope/extender-name']};

	resolveExtends(input, {
		prefix: 'prefix',
		resolve: id,
		require(id) {
			expect(id).toBe('@scope/extender-name');
		}
	});
});

test('adds prefix as suffix for scopes only', t => {
	const input = {extends: ['@scope']};

	resolveExtends(input, {
		prefix: 'prefix',
		resolve: id,
		require(id) {
			expect(id).toBe('@scope/prefix');
		}
	});
});

test('ignores prefix for relative extends', t => {
	const input = {extends: ['./extender']};

	resolveExtends(input, {
		prefix: 'prefix',
		resolve: id,
		require(id) {
			expect(id).toBe('./extender');
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

	expect(actual.foo).toBe('bar');
});

test('resolves extends recursively', t => {
	const input = {extends: ['extender-name']};
	const actual: string[] = [];

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

	expect(actual).toBe(['extender-name', 'recursive-extender-name']);
});

test('uses prefix key recursively', t => {
	const input = {extends: ['extender-name']};
	const actual: string[] = [];

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

	expect(actual).toEqual([
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

	expect(actual).toEqual(expected);
});

test('propagates contents recursively with overlap', t => {
	const input = {extends: ['extender-name']};

	const actual = resolveExtends(input, {
		resolve: id,
		require(id) {
			if (id === 'extender-name') {
				return {
					extends: ['recursive-extender-name'],
					rules: {rule: ['zero', 'one']}
				};
			}
			if (id === 'recursive-extender-name') {
				return {rules: {rule: ['two', 'three', 'four']}};
			}
		}
	});

	const expected = {
		extends: ['extender-name'],
		rules: {
			rule: ['zero', 'one']
		}
	};

	expect(actual).toEqual(expected);
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

	expect(actual).toEqual(expected);
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

	expect(actual).toEqual({
		extends: ['extender-name'],
		rules: {
			fallback: true
		}
	});
});
