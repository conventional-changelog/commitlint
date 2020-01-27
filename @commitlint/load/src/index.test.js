import path from 'path';
import {fix, git, npm} from '@commitlint/test';
import execa from 'execa';
import resolveFrom from 'resolve-from';

import load from '.';

const baseCwd = process.cwd();

afterEach(() => {
	process.chdir(baseCwd);

	jest.restoreAllMocks();
});

test('default cwd option to process.cwd()', async () => {
	const cwd = await fix.bootstrap('fixtures/basic');
	process.chdir(cwd);

	const actual = await load();
	expect(actual.rules.basic).toBe(true);
});

test('extends-empty should have no rules', async () => {
	const cwd = await git.bootstrap('fixtures/extends-empty');
	const actual = await load({}, {cwd});
	expect(actual.rules).toEqual({});
});

test('uses seed as configured', async () => {
	const cwd = await git.bootstrap('fixtures/extends-empty');
	const actual = await load({rules: {foo: 'bar'}}, {cwd});
	expect(actual.rules.foo).toBe('bar');
});

test('rules should be loaded from relative config file', async () => {
	const file = 'config/commitlint.config.js';
	const cwd = await git.bootstrap('fixtures/specify-config-file');
	const actual = await load({}, {cwd, file});
	expect(actual.rules.foo).toBe('bar');
});

test('rules should be loaded from absolute config file', async () => {
	const cwd = await git.bootstrap('fixtures/specify-config-file');
	const file = path.join(cwd, 'config/commitlint.config.js');
	const actual = await load({}, {cwd: process.cwd(), file});
	expect(actual.rules.foo).toBe('bar');
});

test('plugins should be loaded from seed', async () => {
	const mock1 = jest.mock(
		'commitlint-plugin-example',
		() => ({'@global': true}),
		{
			virtual: true
		}
	);
	const mock2 = jest.mock(
		'@scope/commitlint-plugin-example',
		() => ({'@global': true}),
		{
			virtual: true
		}
	);

	const cwd = await git.bootstrap('fixtures/extends-empty');
	const actual = await load({plugins: ['example', '@scope/example']}, {cwd});

	expect(actual.plugins).toEqual({
		example: {'@global': true},
		'@scope/example': {'@global': true}
	});
});

test('plugins should be loaded from config', async () => {
	jest.mock('commitlint-plugin-example', () => ({'@global': true}), {
		virtual: true
	});
	jest.mock('@scope/commitlint-plugin-example', () => ({'@global': true}), {
		virtual: true
	});

	const cwd = await git.bootstrap('fixtures/extends-plugins');
	const actual = await load({}, {cwd});
	expect(actual.plugins).toEqual({
		example: {'@global': true},
		'@scope/example': {'@global': true}
	});
});

test('uses seed with parserPreset', async () => {
	const cwd = await git.bootstrap('fixtures/parser-preset');
	const {parserPreset: actual} = await load(
		{
			parserPreset: './conventional-changelog-custom'
		},
		{cwd}
	);
	expect(actual.name).toBe('./conventional-changelog-custom');
	expect(actual.parserOpts).toEqual({
		headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
	});
});

test('invalid extend should throw', async () => {
	const cwd = await git.bootstrap('fixtures/extends-invalid');
	await expect(load({}, {cwd})).rejects.toThrow(
		'Cannot find module "conventional-changelog-lint-config-____foooooo"'
	);
});

test('empty file should have no rules', async () => {
	const cwd = await git.bootstrap('fixtures/empty-object-file');
	const actual = await load({}, {cwd});
	expect(actual.rules).toEqual({});
});

test('empty file should extend nothing', async () => {
	const cwd = await git.bootstrap('fixtures/empty-file');
	const actual = await load({}, {cwd});
	expect(actual.extends).toEqual([]);
});

test('respects cwd option', async () => {
	const cwd = await git.bootstrap('fixtures/recursive-extends/first-extended');
	const actual = await load({}, {cwd});
	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: ['./second-extended'],
		plugins: {},
		rules: {
			one: 1,
			two: 2
		}
	});
});

test('recursive extends', async () => {
	const cwd = await git.bootstrap('fixtures/recursive-extends');
	const actual = await load({}, {cwd});
	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('recursive extends with json file', async () => {
	const cwd = await git.bootstrap('fixtures/recursive-extends-json');
	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('recursive extends with yaml file', async () => {
	const cwd = await git.bootstrap('fixtures/recursive-extends-yaml');
	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('recursive extends with js file', async () => {
	const cwd = await git.bootstrap('fixtures/recursive-extends-js');
	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('recursive extends with package.json file', async () => {
	const cwd = await git.bootstrap('fixtures/recursive-extends-package');
	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: ['./first-extended'],
		plugins: {},
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('parser preset overwrites completely instead of merging', async () => {
	const cwd = await git.bootstrap('fixtures/parser-preset-override');
	const actual = await load({}, {cwd});
	expect(actual.parserPreset.name).toBe('./custom');
	expect(actual.parserPreset.parserOpts).toEqual({
		headerPattern: /.*/
	});
});

test('recursive extends with parserPreset', async () => {
	const cwd = await git.bootstrap('fixtures/recursive-parser-preset');
	const actual = await load({}, {cwd});
	expect(actual.parserPreset.name).toBe('./conventional-changelog-custom');
	expect(typeof actual.parserPreset.parserOpts).toBe('object');
	expect(actual.parserPreset.parserOpts.headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?-(.*)$/
	);
});

test('ignores unknow keys', async () => {
	const cwd = await git.bootstrap('fixtures/trash-file');
	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: [],
		plugins: {},
		rules: {
			foo: 'bar',
			baz: 'bar'
		}
	});
});

test('ignores unknow keys recursively', async () => {
	const cwd = await git.bootstrap('fixtures/trash-extend');
	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: ['./one'],
		plugins: {},
		rules: {
			zero: 0,
			one: 1
		}
	});
});

test('find up from given cwd', async () => {
	const outer = await fix.bootstrap('fixtures/outer-scope');
	await git.init(path.join(outer, 'inner-scope'));
	const cwd = path.join(outer, 'inner-scope', 'child-scope');

	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: [],
		plugins: {},
		rules: {
			child: true,
			inner: false,
			outer: false
		}
	});
});

test('find up config from outside current git repo', async () => {
	const outer = await fix.bootstrap('fixtures/outer-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));
	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: '@commitlint/format',
		extends: [],
		plugins: {},
		rules: {
			child: false,
			inner: false,
			outer: true
		}
	});
});

test('respects formatter option', async () => {
	const cwd = await git.bootstrap('fixtures/formatter');
	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: 'commitlint-junit',
		extends: [],
		plugins: {},
		rules: {}
	});
});

test('resolves formatter relative from config directory', async () => {
	const cwd = await git.bootstrap('fixtures/formatter-local-module');
	const actual = await load({}, {cwd});

	expect(actual).toEqual({
		formatter: resolveFrom(cwd, './formatters/custom.js'),
		extends: [],
		plugins: {},
		rules: {}
	});
});

test('returns formatter name when unable to resolve from config directory', async () => {
	const cwd = await git.bootstrap('fixtures/formatter-local-module');
	const actual = await load({formatter: './doesnt/exists.js'}, {cwd});

	expect(actual).toEqual({
		formatter: './doesnt/exists.js',
		extends: [],
		plugins: {},
		rules: {}
	});
});

test('does not mutate config module reference', async () => {
	const file = 'config/commitlint.config.js';
	const cwd = await git.bootstrap('fixtures/specify-config-file');

	const configPath = path.join(cwd, file);
	const before = JSON.stringify(require(configPath));
	await load({arbitraryField: true}, {cwd, file});
	const after = JSON.stringify(require(configPath));

	expect(before).toEqual(after);
});

test('resolves parser preset from conventional commits', async () => {
	const cwd = await npm.bootstrap('fixtures/parser-preset-conventionalcommits');
	const actual = await load({}, {cwd});

	expect(actual.parserPreset.name).toBe(
		'conventional-changelog-conventionalcommits'
	);
	expect(typeof actual.parserPreset.parserOpts).toBe('object');
	expect(actual.parserPreset.parserOpts.headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?!?: (.*)$/
	);
});

test('resolves parser preset from conventional angular', async () => {
	const cwd = await npm.bootstrap('fixtures/parser-preset-angular');
	const actual = await load({}, {cwd});

	expect(actual.parserPreset.name).toBe('conventional-changelog-angular');
	expect(typeof actual.parserPreset.parserOpts).toBe('object');
	expect(actual.parserPreset.parserOpts.headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?: (.*)$/
	);
});

test('recursive resolves parser preset from conventional atom', async () => {
	const cwd = await git.bootstrap(
		'fixtures/recursive-parser-preset-conventional-atom'
	);
	// the package file is nested in 2 folders, `npm.bootstrap` cant do that
	await execa('npm', ['install'], {
		cwd: path.resolve(cwd, 'first-extended', 'second-extended')
	});

	const actual = await load({}, {cwd});

	expect(actual.parserPreset.name).toBe('conventional-changelog-atom');
	expect(typeof actual.parserPreset.parserOpts).toBe('object');
	expect(actual.parserPreset.parserOpts.headerPattern).toEqual(
		/^(:.*?:) (.*)$/
	);
});

test('resolves parser preset from conventional commits without factory support', async () => {
	const cwd = await npm.bootstrap(
		'fixtures/parser-preset-conventional-without-factory'
	);
	const actual = await load({}, {cwd});

	expect(actual.parserPreset.name).toBe(
		'conventional-changelog-conventionalcommits'
	);
	expect(typeof actual.parserPreset.parserOpts).toBe('object');
	expect(actual.parserPreset.parserOpts.headerPattern).toEqual(
		/^(\w*)(?:\((.*)\))?!?: (.*)$/
	);
});
