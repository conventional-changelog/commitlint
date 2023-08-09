const plugin = jest.fn();
const scopedPlugin = jest.fn();

jest.mock('commitlint-plugin-example', () => plugin, {virtual: true});
jest.mock('@scope/commitlint-plugin-example', () => scopedPlugin, {
	virtual: true,
});

import path from 'path';
import resolveFrom from 'resolve-from';
import {fix, git, npm} from '@commitlint/test';

import load from './load';

const fixBootstrap = (name: string) => fix.bootstrap(name, __dirname);
const gitBootstrap = (name: string) => git.bootstrap(name, __dirname);
const npmBootstrap = (name: string) => npm.bootstrap(name, __dirname);

test('extends-empty should have no rules', async () => {
	const cwd = await gitBootstrap('fixtures/extends-empty');
	const actual = await load({}, {cwd});

	expect(actual.rules).toMatchObject({});
	expect(actual.parserPreset).not.toBeDefined();
});

test('uses seed as configured', async () => {
	const cwd = await gitBootstrap('fixtures/extends-empty');
	const rules = {'body-case': [1, 'never', 'camel-case'] as any};

	const actual = await load({rules}, {cwd});

	expect(actual.rules['body-case']).toStrictEqual([1, 'never', 'camel-case']);
});

test('rules should be loaded from local', async () => {
	const actual = await load({
		rules: {
			direct: [1, 'never', 'foo'],
			func: () => [1, 'never', 'foo'],
			async: async () => [1, 'never', 'foo'],
			promise: () => Promise.resolve([1, 'never', 'foo']),
		},
	});

	expect(actual.rules['direct']).toStrictEqual([1, 'never', 'foo']);
	expect(actual.rules['func']).toStrictEqual([1, 'never', 'foo']);
	expect(actual.rules['async']).toStrictEqual([1, 'never', 'foo']);
	expect(actual.rules['promise']).toStrictEqual([1, 'never', 'foo']);
});

test('rules should be loaded from relative config file', async () => {
	const file = 'config/commitlint.config.js';
	const cwd = await gitBootstrap('fixtures/specify-config-file');
	const rules = {'body-case': [1, 'never', 'camel-case'] as any};

	const actual = await load({rules}, {cwd, file});

	expect(actual.rules['body-case']).toStrictEqual([1, 'never', 'camel-case']);
});

test('rules should be loaded from absolute config file', async () => {
	const cwd = await gitBootstrap('fixtures/specify-config-file');
	const file = path.resolve(cwd, 'config/commitlint.config.js');
	const rules = {'body-case': [1, 'never', 'camel-case'] as any};

	const actual = await load({rules}, {cwd: process.cwd(), file});

	expect(actual.rules['body-case']).toStrictEqual([1, 'never', 'camel-case']);
});

test('plugins should be loaded from seed', async () => {
	const cwd = await gitBootstrap('fixtures/extends-empty');
	const actual = await load({plugins: ['example', '@scope/example']}, {cwd});

	expect(actual.plugins).toMatchObject({
		example: plugin,
		'@scope/example': scopedPlugin,
	});
});

test('plugins should be loaded from local', async () => {
	const actual = await load({
		plugins: [
			{
				rules: {
					test: () => [true, 'asd'],
				},
			},
		],
	});

	expect(actual.plugins).toEqual(
		expect.objectContaining({
			local: {
				rules: {
					test: expect.any(Function),
				},
			},
		})
	);
});

test('plugins should be loaded from config', async () => {
	const cwd = await gitBootstrap('fixtures/extends-plugins');
	const actual = await load({}, {cwd});

	expect(actual.plugins).toMatchObject({
		example: plugin,
		'@scope/example': scopedPlugin,
	});
});

test('plugins should be loaded from shareable config', async () => {
	const cwd = await gitBootstrap('fixtures/extends-with-plugins');
	const actual = await load({}, {cwd});

	expect(actual.plugins).toMatchObject({
		example: plugin,
		'@scope/example': scopedPlugin,
	});
});

test('local plugins should be loaded from shareable configs', async () => {
	const cwd = await gitBootstrap('fixtures/extends-with-local-plugins');
	const actual = await load({}, {cwd});

	expect(actual.plugins).toEqual(
		expect.objectContaining({
			local: {
				rules: {
					'hello-world-rule': expect.any(Function),
					'is-positive': expect.any(Function),
				},
			},
		})
	);
});

test('uses seed with parserPreset', async () => {
	const cwd = await gitBootstrap('fixtures/parser-preset');
	const {parserPreset: actual} = await load(
		{parserPreset: './conventional-changelog-custom'},
		{cwd}
	);

	expect(actual).toBeDefined();
	expect(actual!.name).toBe('./conventional-changelog-custom');
	expect(actual!.parserOpts).toMatchObject({
		headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/,
	});
});

test('invalid extend should throw', async () => {
	const cwd = await gitBootstrap('fixtures/extends-invalid');

	await expect(load({}, {cwd})).rejects.toThrow();
});

test('empty file should have no rules', async () => {
	const cwd = await gitBootstrap('fixtures/empty-object-file');
	const actual = await load({}, {cwd});

	expect(actual.rules).toMatchObject({});
});

test('empty file should extend nothing', async () => {
	const cwd = await gitBootstrap('fixtures/empty-file');
	const actual = await load({}, {cwd});

	expect(actual.extends).toHaveLength(0);
});

test('respects cwd option', async () => {
	const cwd = await gitBootstrap('fixtures/recursive-extends/first-extended');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: ['./second-extended'],
		plugins: {},
		rules: {
			one: [1, 'always'],
			two: [2, 'never'],
		},
	});
});

test('recursive extends', async () => {
	const cwd = await gitBootstrap('fixtures/recursive-extends');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: [0, 'never'],
			one: [1, 'always'],
			two: [2, 'never'],
		},
	});
});

test('recursive extends with json file', async () => {
	const cwd = await gitBootstrap('fixtures/recursive-extends-json');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: [0, 'never'],
			one: [1, 'always'],
			two: [2, 'never'],
		},
	});
});

test('recursive extends with yaml file', async () => {
	const cwd = await gitBootstrap('fixtures/recursive-extends-yaml');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: [0, 'never'],
			one: [1, 'never'],
			two: [2, 'always'],
		},
	});
});

test('recursive extends with js file', async () => {
	const cwd = await gitBootstrap('fixtures/recursive-extends-js');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: [0, 'never'],
			one: [1, 'never'],
			two: [2, 'always'],
		},
	});
});

test('recursive extends with package.json file', async () => {
	const cwd = await gitBootstrap('fixtures/recursive-extends-package');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: [0, 'never'],
			one: [1, 'never'],
			two: [2, 'never'],
		},
	});
});

// fails since a jest update: https://github.com/conventional-changelog/commitlint/pull/3362
// eslint-disable-next-line jest/no-disabled-tests
test.skip('recursive extends with ts file', async () => {
	const cwd = await gitBootstrap('fixtures/recursive-extends-ts');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: [0, 'never', 'zero'],
			one: [1, 'never', 'one'],
			two: [2, 'never', 'two'],
		},
	});
});

test('parser preset overwrites completely instead of merging', async () => {
	const cwd = await gitBootstrap('fixtures/parser-preset-override');
	const actual = await load({}, {cwd});

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe('./custom');
	expect(actual.parserPreset!.parserOpts).toMatchObject({
		headerPattern: /.*/,
	});
});

test('recursive extends with parserPreset', async () => {
	const cwd = await gitBootstrap('fixtures/recursive-parser-preset');
	const actual = await load({}, {cwd});

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe('./conventional-changelog-custom');
	expect(actual.parserPreset!.parserOpts).toMatchObject({
		headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/,
	});
});

test('ignores unknown keys', async () => {
	const cwd = await gitBootstrap('fixtures/trash-file');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: [],
		plugins: {},
		rules: {
			foo: [1, 'always', 'bar'],
			baz: [1, 'always', 'bar'],
		},
	});
});

test('ignores unknown keys recursively', async () => {
	const cwd = await gitBootstrap('fixtures/trash-extend');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: ['./one'],
		plugins: {},
		rules: {
			zero: [0, 'always', 'zero'],
			one: [1, 'always', 'one'],
		},
	});
});

test('find up from given cwd', async () => {
	const outer = await fixBootstrap('fixtures/outer-scope');
	await git.init(path.join(outer, 'inner-scope'));
	const cwd = path.join(outer, 'inner-scope', 'child-scope');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: [],
		plugins: {},
		rules: {
			child: [2, 'always', true],
			inner: [2, 'always', false],
			outer: [2, 'always', false],
		},
	});
});

test('find up config from outside current git repo', async () => {
	const outer = await fixBootstrap('fixtures/outer-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: '@commitlint/format',
		extends: [],
		plugins: {},
		rules: {
			child: [1, 'never', false],
			inner: [1, 'never', false],
			outer: [1, 'never', true],
		},
	});
});

test('respects formatter option', async () => {
	const cwd = await gitBootstrap('fixtures/formatter');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: 'commitlint-junit',
		extends: [],
		plugins: {},
		rules: {},
	});
});

test('resolves formatter relative from config directory', async () => {
	const cwd = await gitBootstrap('fixtures/formatter-local-module');
	const actual = await load({}, {cwd});

	expect(actual).toMatchObject({
		formatter: resolveFrom(cwd, './formatters/custom.js'),
		extends: [],
		plugins: {},
		rules: {},
	});
});

test('returns formatter name when unable to resolve from config directory', async () => {
	const cwd = await gitBootstrap('fixtures/formatter-local-module');
	const actual = await load({formatter: './doesnt/exists.js'}, {cwd});

	expect(actual).toMatchObject({
		formatter: './doesnt/exists.js',
		extends: [],
		plugins: {},
		rules: {},
	});
});

test('does not mutate config module reference', async () => {
	const file = 'config/commitlint.config.js';
	const cwd = await gitBootstrap('fixtures/specify-config-file');
	const rules = {'body-case': [1, 'never', 'camel-case'] as any};

	const configPath = path.join(cwd, file);
	const before = JSON.stringify(require(configPath));
	await load({rules}, {cwd, file});
	const after = JSON.stringify(require(configPath));

	expect(after).toBe(before);
});

test('resolves parser preset from conventional commits', async () => {
	const cwd = await npmBootstrap('fixtures/parser-preset-conventionalcommits');
	const actual = await load({}, {cwd});

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe(
		'conventional-changelog-conventionalcommits'
	);
	expect(typeof actual.parserPreset!.parserOpts).toBe('object');
	expect((actual.parserPreset!.parserOpts as any).headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?!?: (.*)$/
	);
});

test('resolves parser preset from conventional angular', async () => {
	const cwd = await npmBootstrap('fixtures/parser-preset-angular');
	const actual = await load({}, {cwd});

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe('conventional-changelog-angular');
	expect(typeof actual.parserPreset!.parserOpts).toBe('object');
	expect((actual.parserPreset!.parserOpts as any).headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?: (.*)$/
	);
});

test('recursive resolves parser preset from conventional atom', async () => {
	const cwd = await gitBootstrap(
		'fixtures/recursive-parser-preset-conventional-atom'
	);
	await npm.installModules(
		path.resolve(cwd, 'first-extended', 'second-extended')
	);

	const actual = await load({}, {cwd});

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe('conventional-changelog-atom');
	expect(typeof actual.parserPreset!.parserOpts).toBe('object');
	expect((actual.parserPreset!.parserOpts as any).headerPattern).toEqual(
		/^(:.*?:) (.*)$/
	);
});

test('resolves parser preset from conventional commits without factory support', async () => {
	const cwd = await npmBootstrap(
		'fixtures/parser-preset-conventional-without-factory'
	);
	const actual = await load({}, {cwd});

	expect(actual.parserPreset).toBeDefined();
	expect(actual.parserPreset!.name).toBe(
		'conventional-changelog-conventionalcommits'
	);
	expect(typeof actual.parserPreset!.parserOpts).toBe('object');
	expect((actual.parserPreset!.parserOpts as any).headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?!?: (.*)$/
	);
});

test('helpUrl should be loaded from the shareable config', async () => {
	const cwd = await gitBootstrap('fixtures/help-url');
	const actual = await load({}, {cwd});

	expect(actual.helpUrl).toStrictEqual(
		'https://github.com/conventional-changelog/commitlint'
	);
});

test('default helpUrl should be loaded if not provided in shareable configs', async () => {
	const cwd = await gitBootstrap('fixtures/basic');
	const actual = await load({}, {cwd});

	expect(actual.helpUrl).toStrictEqual(
		'https://github.com/conventional-changelog/commitlint/#what-is-commitlint'
	);
});
