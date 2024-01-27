import {createRequire} from 'module';
import {pathToFileURL} from 'url';

import {RuleConfigSeverity, UserConfig} from '@commitlint/types';

import resolveExtends, {ResolveExtendsContext} from './index.js';

const require = createRequire(import.meta.url);

const id = (id: unknown) => id;

test('returns empty object when called without params', async () => {
	const actual = await resolveExtends();
	expect(actual).toEqual({});
});

test('returns an equivalent object as passed in', async () => {
	const expected = {foo: 'bar'};
	const actual = await resolveExtends(expected);
	expect(actual).toEqual(expected);
});

test('falls back to global install', async () => {
	const resolveGlobal = vi.fn(() => '@commitlint/foo-bar');
	const dynamicImport = vi.fn(() => ({}));

	const ctx = {resolveGlobal, dynamicImport} as ResolveExtendsContext;

	resolveExtends({extends: ['@commitlint/foo-bar']}, ctx);
	expect(ctx.resolveGlobal).toHaveBeenCalledWith('@commitlint/foo-bar');
});

test('fails for missing extends', async () => {
	await expect(() =>
		resolveExtends({extends: ['@commitlint/foo-bar']})
	).rejects.toThrow(/Cannot find module "@commitlint\/foo-bar" from/);
});

test('resolves extends for single config', async () => {
	const input = {extends: 'extender-name'};
	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(() => ({})),
	} as ResolveExtendsContext;
	await resolveExtends(input, ctx);

	expect(ctx.dynamicImport).toHaveBeenCalledWith('extender-name');
});

test('uses empty prefix by default', async () => {
	const input = {extends: ['extender-name']};
	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(() => ({})),
	} as ResolveExtendsContext;
	await resolveExtends(input, ctx);

	expect(ctx.dynamicImport).toHaveBeenCalledWith('extender-name');
});

test('uses prefix as configured', async () => {
	const input = {extends: ['extender-name']};
	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(() => ({})),
	} as ResolveExtendsContext;

	await resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.dynamicImport).toHaveBeenCalledWith('prefix-extender-name');
});

test('ignores prefix for scoped extends', async () => {
	const input = {extends: ['@scope/extender-name']};
	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(() => ({})),
	} as ResolveExtendsContext;

	await resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.dynamicImport).toHaveBeenCalledWith('@scope/extender-name');
});

test('adds prefix as suffix for scopes only', async () => {
	const input = {extends: ['@scope']};
	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(() => ({})),
	} as ResolveExtendsContext;

	await resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.dynamicImport).toHaveBeenCalledWith('@scope/prefix');
});

test('ignores prefix for relative extends', async () => {
	const input = {extends: ['./extender']};
	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(() => ({})),
	} as ResolveExtendsContext;

	await resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.dynamicImport).toHaveBeenCalledWith('./extender');
});

test('ignores prefix for absolute extends', async () => {
	const absolutePath = require.resolve('@commitlint/config-angular');
	const input = {extends: [absolutePath]};
	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(() => ({})),
	} as ResolveExtendsContext;

	await resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.dynamicImport).toHaveBeenCalledWith(
		pathToFileURL(absolutePath).toString()
	);
});

test('propagates return value of require function', async () => {
	const input = {extends: ['extender-name']};
	const propagated = {foo: 'bar'};
	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(() => propagated),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);
	expect(actual).toEqual(expect.objectContaining(propagated));
});

test('resolves extends recursively', async () => {
	const input = {extends: ['extender-name']};

	const dynamicImport = (id: string) => {
		switch (id) {
			case 'extender-name':
				return {extends: ['recursive-extender-name']};
			case 'recursive-extender-name':
				return {foo: 'bar'};
			default:
				return {};
		}
	};

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;
	await resolveExtends(input, ctx);

	expect(ctx.dynamicImport).toHaveBeenCalledWith('extender-name');
	expect(ctx.dynamicImport).toHaveBeenCalledWith('recursive-extender-name');
});

test('uses prefix key recursively', async () => {
	const input = {extends: ['extender-name']};

	const dynamicImport = (id: string) => {
		switch (id) {
			case 'prefix-extender-name':
				return {extends: ['recursive-extender-name']};
			case 'prefix-recursive-extender-name':
				return {foo: 'bar'};
			default:
				return {};
		}
	};

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	await resolveExtends(input, {
		...ctx,
		prefix: 'prefix',
	});

	expect(ctx.dynamicImport).toHaveBeenCalledWith('prefix-extender-name');
	expect(ctx.dynamicImport).toHaveBeenCalledWith(
		'prefix-recursive-extender-name'
	);
});

test('propagates contents recursively', async () => {
	const input = {extends: ['extender-name']};

	const dynamicImport = (id: string) => {
		switch (id) {
			case 'extender-name':
				return {extends: ['recursive-extender-name'], foo: 'bar'};
			case 'recursive-extender-name':
				return {baz: 'bar'};
			default:
				return {};
		}
	};

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-name'],
		foo: 'bar',
		baz: 'bar',
	};

	expect(actual).toEqual(expected);
});

test('propagates contents recursively with overlap', async () => {
	const input: UserConfig = {extends: ['extender-name']};

	const dynamicImport = (id: string): UserConfig => {
		switch (id) {
			case 'extender-name':
				return {
					extends: ['recursive-extender-name'],
					rules: {rule: [RuleConfigSeverity.Warning, 'always']},
				};
			case 'recursive-extender-name':
				return {rules: {rule: [RuleConfigSeverity.Error, 'never', 'four']}};
			default:
				return {};
		}
	};

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);

	const expected: UserConfig = {
		extends: ['extender-name'],
		rules: {
			rule: [RuleConfigSeverity.Warning, 'always'],
		},
	};

	expect(actual).toEqual(expected);
});

test('extends rules from left to right with overlap', async () => {
	const input: UserConfig = {extends: ['left', 'right']};

	const dynamicImport = (id: string): UserConfig => {
		switch (id) {
			case 'left':
				return {rules: {a: [RuleConfigSeverity.Disabled, 'never', true]}};
			case 'right':
				return {rules: {a: [RuleConfigSeverity.Disabled, 'never', false], b: [RuleConfigSeverity.Disabled, 'never', true]}};
			default:
				return {};
		}
	};

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);

	const expected: UserConfig = {
		extends: ['left', 'right'],
		rules: {
			a: [RuleConfigSeverity.Disabled, 'never', false],
			b: [RuleConfigSeverity.Disabled, 'never', true],
		},
	};

	expect(actual).toEqual(expected);
});

test('extending contents should take precedence', async () => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const dynamicImport = (id: string) => {
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

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-name'],
		zero: 'root',
		one: 'extender-name',
		two: 'recursive-extender-name',
		three: 'second-recursive-extender-name',
	};

	expect(actual).toEqual(expected);
});

test('should fall back to conventional-changelog-lint-config prefix', async () => {
	const input = {extends: ['extender-name']};

	const resolve = (id: string) => {
		if (id === 'conventional-changelog-lint-config-extender-name') {
			return 'conventional-changelog-lint-config-extender-name';
		}
		throw new Error(`Could not find module "*${id}"`);
	};

	const dynamicImport = (id: string) => {
		switch (id) {
			case 'conventional-changelog-lint-config-extender-name':
				return {rules: {fallback: true}};
			default:
				return {};
		}
	};

	const ctx = {
		resolve: vi.fn(resolve),
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, {
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

test('plugins should be merged correctly', async () => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const dynamicImport = (id: string) => {
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

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-name'],
		plugins: ['test3', 'test2', 'test'],
		zero: 'root',
	};

	expect(actual).toEqual(expected);
});

test('rules should be merged correctly', async () => {
	const input: UserConfig = {
		extends: ['extender-name'],
		rules: {test1: [RuleConfigSeverity.Warning, 'never', 'base']},
	};

	const dynamicImport = (id: string): UserConfig => {
		switch (id) {
			case 'extender-name':
				return {
					extends: ['recursive-extender-name'],
					rules: {test2: [RuleConfigSeverity.Error, 'never', id]},
				};
			case 'recursive-extender-name':
				return {
					extends: ['second-recursive-extender-name'],
					rules: {test1: [RuleConfigSeverity.Disabled, 'never', id]},
				};
			case 'second-recursive-extender-name':
				return {rules: {test2: [RuleConfigSeverity.Warning, 'never', id]}};
			default:
				return {};
		}
	};

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);

	const expected: UserConfig = {
		extends: ['extender-name'],
		rules: {
			test1: [RuleConfigSeverity.Warning, 'never', 'base'],
			test2: [RuleConfigSeverity.Error, 'never', 'extender-name'],
		},
	};

	expect(actual).toEqual(expected);
});

// https://github.com/conventional-changelog/commitlint/issues/327
test('parserPreset should resolve correctly in extended configuration', async () => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const dynamicImport = (id: string) => {
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

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);

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

test('parserPreset should be merged correctly', async () => {
	const input = {extends: ['extender-name'], zero: 'root'};

	const dynamicImport = (id: string) => {
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

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);

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

test('should correctly merge nested configs', async () => {
	const input = {extends: ['extender-1']};

	const dynamicImport = (id: string) => {
		switch (id) {
			case 'extender-1':
				return {extends: ['extender-3', 'extender-2']};
			case 'extender-2':
				return {extends: ['extender-4']};
			case 'extender-3':
				return {rules: {test: [RuleConfigSeverity.Warning, 'never', 3]}};
			case 'extender-4':
				return {
					extends: ['extender-5', 'extender-6'],
					rules: {test: [RuleConfigSeverity.Warning, 'never', 4]},
				};
			case 'extender-5':
				return {rules: {test: [RuleConfigSeverity.Warning, 'never', 5]}};
			case 'extender-6':
				return {rules: {test: [RuleConfigSeverity.Warning, 'never', 6]}};
			default:
				return {};
		}
	};

	const ctx = {
		resolve: id,
		dynamicImport: vi.fn(dynamicImport),
	} as ResolveExtendsContext;

	const actual = await resolveExtends(input, ctx);

	const expected = {
		extends: ['extender-1'],
		rules: {
			test: [RuleConfigSeverity.Warning, 'never', 4],
		},
	};

	expect(actual).toEqual(expected);
});
