import resolveExtends, {ResolveExtendsContext} from '.';
import {UserConfig} from '@commitlint/types';

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
	const resolveGlobal = jest.fn(() => '@commitlint/foo-bar');
	const require = jest.fn(() => ({}));

	const ctx = {resolveGlobal, require} as ResolveExtendsContext;

	resolveExtends({extends: ['@commitlint/foo-bar']}, ctx);
	expect(ctx.resolveGlobal).toHaveBeenCalledWith('@commitlint/foo-bar');
});

test('fails for missing extends', async () => {
	expect(() => resolveExtends({extends: ['@commitlint/foo-bar']})).toThrow(
		/Cannot find module "@commitlint\/foo-bar" from/
	);
});

test('resolves extends for single config', () => {
	const input = {extends: 'extender-name'};
	const ctx = {
		resolve: id,
		require: jest.fn(() => ({})),
	} as ResolveExtendsContext;
	resolveExtends(input, ctx);

	expect(ctx.require).toHaveBeenCalledWith('extender-name');
});

test('uses empty prefix by default', () => {
	const input = {extends: ['extender-name']};
	const ctx = {
		resolve: id,
		require: jest.fn(() => ({})),
	} as ResolveExtendsContext;
	resolveExtends(input, ctx);

	expect(ctx.require).toHaveBeenCalledWith('extender-name');
});

test('uses prefix as configured', () => {
	const input = {extends: ['extender-name']};
	const ctx = {
		resolve: id,
		require: jest.fn(() => ({})),
	} as ResolveExtendsContext;

	resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.require).toHaveBeenCalledWith('prefix-extender-name');
});

test('ignores prefix for scoped extends', () => {
	const input = {extends: ['@scope/extender-name']};
	const ctx = {
		resolve: id,
		require: jest.fn(() => ({})),
	} as ResolveExtendsContext;

	resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.require).toHaveBeenCalledWith('@scope/extender-name');
});

test('adds prefix as suffix for scopes only', () => {
	const input = {extends: ['@scope']};
	const ctx = {
		resolve: id,
		require: jest.fn(() => ({})),
	} as ResolveExtendsContext;

	resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.require).toHaveBeenCalledWith('@scope/prefix');
});

test('ignores prefix for relative extends', () => {
	const input = {extends: ['./extender']};
	const ctx = {
		resolve: id,
		require: jest.fn(() => ({})),
	} as ResolveExtendsContext;

	resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.require).toHaveBeenCalledWith('./extender');
});

test('ignores prefix for absolute extends', () => {
	const absolutePath = require.resolve('@commitlint/config-angular');
	const input = {extends: [absolutePath]};
	const ctx = {
		resolve: id,
		require: jest.fn(() => ({})),
	} as ResolveExtendsContext;

	resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.require).toHaveBeenCalledWith(absolutePath);
});

test('propagates return value of require function', () => {
	const input = {extends: ['extender-name']};
	const propagated = {foo: 'bar'};
	const ctx = {
		resolve: id,
		require: jest.fn(() => propagated),
	} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);
	expect(actual).toEqual(expect.objectContaining(propagated));
});

test('resolves extends recursively', () => {
	const input = {extends: ['extender-name']};

	const require = (id: string) => {
		switch (id) {
			case 'extender-name':
				return {extends: ['recursive-extender-name']};
			case 'recursive-extender-name':
				return {foo: 'bar'};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;
	resolveExtends(input, ctx);

	expect(ctx.require).toHaveBeenCalledWith('extender-name');
	expect(ctx.require).toHaveBeenCalledWith('recursive-extender-name');
});

test('uses prefix key recursively', () => {
	const input = {extends: ['extender-name']};

	const require = (id: string) => {
		switch (id) {
			case 'prefix-extender-name':
				return {extends: ['recursive-extender-name']};
			case 'prefix-recursive-extender-name':
				return {foo: 'bar'};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.require).toHaveBeenCalledWith('prefix-extender-name');
	expect(ctx.require).toHaveBeenCalledWith('prefix-recursive-extender-name');
});

test('propagates contents recursively', () => {
	const input = {extends: ['extender-name']};

	const require = (id: string) => {
		switch (id) {
			case 'extender-name':
				return {extends: ['recursive-extender-name'], foo: 'bar'};
			case 'recursive-extender-name':
				return {baz: 'bar'};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-name'],
		foo: 'bar',
		baz: 'bar',
	};

	expect(actual).toEqual(expected);
});

test('propagates contents recursively with overlap', () => {
	const input: UserConfig = {extends: ['extender-name']};

	const require = (id: string): UserConfig => {
		switch (id) {
			case 'extender-name':
				return {
					extends: ['recursive-extender-name'],
					rules: {rule: [1, 'always']},
				};
			case 'recursive-extender-name':
				return {rules: {rule: [2, 'never', 'four']}};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);

	const expected: UserConfig = {
		extends: ['extender-name'],
		rules: {
			rule: [1, 'always'],
		},
	};

	expect(actual).toEqual(expected);
});

test('extends rules from left to right with overlap', () => {
	const input: UserConfig = {extends: ['left', 'right']};

	const require = (id: string): UserConfig => {
		switch (id) {
			case 'left':
				return {rules: {a: [0, 'never', true]}};
			case 'right':
				return {rules: {a: [0, 'never', false], b: [0, 'never', true]}};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);

	const expected: UserConfig = {
		extends: ['left', 'right'],
		rules: {
			a: [0, 'never', false],
			b: [0, 'never', true],
		},
	};

	expect(actual).toEqual(expected);
});

test('extending contents should take precedence', () => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const require = (id: string) => {
		switch (id) {
			case 'extender-name':
				return {extends: ['recursive-extender-name'], zero: id, one: id};
			case 'recursive-extender-name':
				return {
					extends: ['second-recursive-extender-name'],
					zero: id,
					one: id,
					two: id,
				};
			case 'second-recursive-extender-name':
				return {zero: id, one: id, two: id, three: id};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-name'],
		zero: 'root',
		one: 'extender-name',
		two: 'recursive-extender-name',
		three: 'second-recursive-extender-name',
	};

	expect(actual).toEqual(expected);
});

test('should fall back to conventional-changelog-lint-config prefix', () => {
	const input = {extends: ['extender-name']};

	const resolve = (id: string) => {
		if (id === 'conventional-changelog-lint-config-extender-name') {
			return 'conventional-changelog-lint-config-extender-name';
		}
		throw new Error(`Could not find module "*${id}"`);
	};

	const require = (id: string) => {
		switch (id) {
			case 'conventional-changelog-lint-config-extender-name':
				return {rules: {fallback: true}};
			default:
				return {};
		}
	};

	const ctx = {
		resolve: jest.fn(resolve),
		require: jest.fn(require),
	} as ResolveExtendsContext;

	const actual = resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(actual).toEqual({
		extends: ['extender-name'],
		rules: {
			fallback: true,
		},
	});
});

test('plugins should be merged correctly', () => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const require = (id: string) => {
		switch (id) {
			case 'extender-name':
				return {extends: ['recursive-extender-name'], plugins: ['test']};
			case 'recursive-extender-name':
				return {
					extends: ['second-recursive-extender-name'],
					plugins: ['test2'],
				};
			case 'second-recursive-extender-name':
				return {plugins: ['test3']};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-name'],
		plugins: ['test3', 'test2', 'test'],
		zero: 'root',
	};

	expect(actual).toEqual(expected);
});

test('rules should be merged correctly', () => {
	const input: UserConfig = {
		extends: ['extender-name'],
		rules: {test1: [1, 'never', 'base']},
	};

	const require = (id: string): UserConfig => {
		switch (id) {
			case 'extender-name':
				return {
					extends: ['recursive-extender-name'],
					rules: {test2: [2, 'never', id]},
				};
			case 'recursive-extender-name':
				return {
					extends: ['second-recursive-extender-name'],
					rules: {test1: [0, 'never', id]},
				};
			case 'second-recursive-extender-name':
				return {rules: {test2: [1, 'never', id]}};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);

	const expected: UserConfig = {
		extends: ['extender-name'],
		rules: {
			test1: [1, 'never', 'base'],
			test2: [2, 'never', 'extender-name'],
		},
	};

	expect(actual).toEqual(expected);
});

// https://github.com/conventional-changelog/commitlint/issues/327
test('parserPreset should resolve correctly in extended configuration', () => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const require = (id: string) => {
		switch (id) {
			case 'extender-name':
				return {
					extends: ['recursive-extender-name'],
					parserPreset: {
						parserOpts: {
							issuePrefixes: ['#', '!', '&', 'no-references'],
							referenceActions: null,
						},
					},
				};
			case 'recursive-extender-name':
				return {parserPreset: {parserOpts: {issuePrefixes: ['#', '!']}}};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-name'],
		parserPreset: {
			parserOpts: {
				issuePrefixes: ['#', '!', '&', 'no-references'],
				referenceActions: null,
			},
		},
		zero: 'root',
	};

	expect(actual).toEqual(expected);
});

test('parserPreset should be merged correctly', () => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const require = (id: string) => {
		switch (id) {
			case 'extender-name':
				return {
					extends: ['recursive-extender-name'],
					parserPreset: {
						parserOpts: {
							referenceActions: null,
						},
					},
				};
			case 'recursive-extender-name':
				return {parserPreset: {parserOpts: {issuePrefixes: ['#', '!']}}};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-name'],
		parserPreset: {
			parserOpts: {
				issuePrefixes: ['#', '!'],
				referenceActions: null,
			},
		},
		zero: 'root',
	};

	expect(actual).toEqual(expected);
});

test('should correctly merge nested configs', () => {
	const input = {extends: ['extender-1']};

	const require = (id: string) => {
		switch (id) {
			case 'extender-1':
				return {extends: ['extender-3', 'extender-2']};
			case 'extender-2':
				return {extends: ['extender-4']};
			case 'extender-3':
				return {rules: {test: [1, 'never', 3]}};
			case 'extender-4':
				return {
					extends: ['extender-5', 'extender-6'],
					rules: {test: [1, 'never', 4]},
				};
			case 'extender-5':
				return {rules: {test: [1, 'never', 5]}};
			case 'extender-6':
				return {rules: {test: [1, 'never', 6]}};
			default:
				return {};
		}
	};

	const ctx = {resolve: id, require: jest.fn(require)} as ResolveExtendsContext;

	const actual = resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-1'],
		rules: {
			test: [1, 'never', 4],
		},
	};

	expect(actual).toEqual(expected);
});
