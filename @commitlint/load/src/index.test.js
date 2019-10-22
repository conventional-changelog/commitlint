import path from 'path';
import {fix, git, npm} from '@commitlint/test';
import test from 'ava';
import execa from 'execa';
import resolveFrom from 'resolve-from';

import load from '.';

const proxyquire = require('proxyquire')
	.noCallThru()
	.noPreserveCache();

test('extends-empty should have no rules', async t => {
	const cwd = await git.bootstrap('fixtures/extends-empty');
	const actual = await load({}, {cwd});
	t.deepEqual(actual.rules, {});
});

test('uses seed as configured', async t => {
	const cwd = await git.bootstrap('fixtures/extends-empty');
	const actual = await load({rules: {foo: 'bar'}}, {cwd});
	t.is(actual.rules.foo, 'bar');
});

test('rules should be loaded from relative config file', async t => {
	const file = 'config/commitlint.config.js';
	const cwd = await git.bootstrap('fixtures/specify-config-file');
	const actual = await load({}, {cwd, file});
	t.is(actual.rules.foo, 'bar');
});

test('rules should be loaded from absolute config file', async t => {
	const cwd = await git.bootstrap('fixtures/specify-config-file');
	const file = path.join(cwd, 'config/commitlint.config.js');
	const actual = await load({}, {cwd: process.cwd(), file});
	t.is(actual.rules.foo, 'bar');
});

test('plugins should be loaded from seed', async t => {
	const plugin = {'@global': true};
	const scopedPlugin = {'@global': true};
	const stubbedLoad = proxyquire('.', {
		'commitlint-plugin-example': plugin,
		'@scope/commitlint-plugin-example': scopedPlugin
	});

	const cwd = await git.bootstrap('fixtures/extends-empty');
	const actual = await stubbedLoad(
		{plugins: ['example', '@scope/example']},
		{cwd}
	);
	t.deepEqual(actual.plugins, {
		example: plugin,
		'@scope/example': scopedPlugin
	});
});

test('plugins should be loaded from config', async t => {
	const plugin = {'@global': true};
	const scopedPlugin = {'@global': true};
	const stubbedLoad = proxyquire('.', {
		'commitlint-plugin-example': plugin,
		'@scope/commitlint-plugin-example': scopedPlugin
	});

	const cwd = await git.bootstrap('fixtures/extends-plugins');
	const actual = await stubbedLoad({}, {cwd});
	t.deepEqual(actual.plugins, {
		example: plugin,
		'@scope/example': scopedPlugin
	});
});

test('uses seed with parserPreset', async t => {
	const cwd = await git.bootstrap('fixtures/parser-preset');
	const {parserPreset: actual} = await load(
		{
			parserPreset: './conventional-changelog-custom'
		},
		{cwd}
	);
	t.is(actual.name, './conventional-changelog-custom');
	t.deepEqual(actual.parserOpts, {
		headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
	});
});

test('invalid extend should throw', async t => {
	const cwd = await git.bootstrap('fixtures/extends-invalid');
	await t.throws(load({}, {cwd}));
});

test('empty file should have no rules', async t => {
	const cwd = await git.bootstrap('fixtures/empty-object-file');
	const actual = await load({}, {cwd});
	t.deepEqual(actual.rules, {});
});

test('empty file should extend nothing', async t => {
	const cwd = await git.bootstrap('fixtures/empty-file');
	const actual = await load({}, {cwd});
	t.deepEqual(actual.extends, []);
});

test('respects cwd option', async t => {
	const cwd = await git.bootstrap('fixtures/recursive-extends/first-extended');
	const actual = await load({}, {cwd});
	t.deepEqual(actual, {
		formatter: '@commitlint/format',
		extends: ['./second-extended'],
		plugins: {},
		rules: {
			one: 1,
			two: 2
		}
	});
});

test('recursive extends', async t => {
	const cwd = await git.bootstrap('fixtures/recursive-extends');
	const actual = await load({}, {cwd});
	t.deepEqual(actual, {
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

test('recursive extends with json file', async t => {
	const cwd = await git.bootstrap('fixtures/recursive-extends-json');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
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

test('recursive extends with yaml file', async t => {
	const cwd = await git.bootstrap('fixtures/recursive-extends-yaml');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
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

test('recursive extends with js file', async t => {
	const cwd = await git.bootstrap('fixtures/recursive-extends-js');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
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

test('recursive extends with package.json file', async t => {
	const cwd = await git.bootstrap('fixtures/recursive-extends-package');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
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

test('parser preset overwrites completely instead of merging', async t => {
	const cwd = await git.bootstrap('fixtures/parser-preset-override');
	const actual = await load({}, {cwd});
	t.is(actual.parserPreset.name, './custom');
	t.deepEqual(actual.parserPreset.parserOpts, {
		headerPattern: /.*/
	});
});

test('recursive extends with parserPreset', async t => {
	const cwd = await git.bootstrap('fixtures/recursive-parser-preset');
	const actual = await load({}, {cwd});
	t.is(actual.parserPreset.name, './conventional-changelog-custom');
	t.is(typeof actual.parserPreset.parserOpts, 'object');
	t.deepEqual(
		actual.parserPreset.parserOpts.headerPattern,
		/^(\w*)(?:\((.*)\))?-(.*)$/
	);
});

test('ignores unknow keys', async t => {
	const cwd = await git.bootstrap('fixtures/trash-file');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		formatter: '@commitlint/format',
		extends: [],
		plugins: {},
		rules: {
			foo: 'bar',
			baz: 'bar'
		}
	});
});

test('ignores unknow keys recursively', async t => {
	const cwd = await git.bootstrap('fixtures/trash-extend');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		formatter: '@commitlint/format',
		extends: ['./one'],
		plugins: {},
		rules: {
			zero: 0,
			one: 1
		}
	});
});

test('find up from given cwd', async t => {
	const outer = await fix.bootstrap('fixtures/outer-scope');
	await git.init(path.join(outer, 'inner-scope'));
	const cwd = path.join(outer, 'inner-scope', 'child-scope');

	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
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

test('find up config from outside current git repo', async t => {
	const outer = await fix.bootstrap('fixtures/outer-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
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

test('respects formatter option', async t => {
	const cwd = await git.bootstrap('fixtures/formatter');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		formatter: 'commitlint-junit',
		extends: [],
		plugins: {},
		rules: {}
	});
});

test('resolves formatter relative from config directory', async t => {
	const cwd = await git.bootstrap('fixtures/formatter-local-module');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		formatter: resolveFrom(cwd, './formatters/custom.js'),
		extends: [],
		plugins: {},
		rules: {}
	});
});

test('returns formatter name when unable to resolve from config directory', async t => {
	const cwd = await git.bootstrap('fixtures/formatter-local-module');
	const actual = await load({formatter: './doesnt/exists.js'}, {cwd});

	t.deepEqual(actual, {
		formatter: './doesnt/exists.js',
		extends: [],
		plugins: {},
		rules: {}
	});
});

test('does not mutate config module reference', async t => {
	const file = 'config/commitlint.config.js';
	const cwd = await git.bootstrap('fixtures/specify-config-file');

	const configPath = path.join(cwd, file);
	const before = JSON.stringify(require(configPath));
	await load({arbitraryField: true}, {cwd, file});
	const after = JSON.stringify(require(configPath));

	t.is(before, after);
});

test('resolves parser preset from conventional commits', async t => {
	const cwd = await npm.bootstrap('fixtures/parser-preset-conventionalcommits');
	const actual = await load({}, {cwd});

	t.is(actual.parserPreset.name, 'conventional-changelog-conventionalcommits');
	t.is(typeof actual.parserPreset.parserOpts, 'object');
	t.deepEqual(
		actual.parserPreset.parserOpts.headerPattern,
		/^(\w*)(?:\((.*)\))?!?: (.*)$/
	);
});

test('resolves parser preset from conventional angular', async t => {
	const cwd = await npm.bootstrap('fixtures/parser-preset-angular');
	const actual = await load({}, {cwd});

	t.is(actual.parserPreset.name, 'conventional-changelog-angular');
	t.is(typeof actual.parserPreset.parserOpts, 'object');
	t.deepEqual(
		actual.parserPreset.parserOpts.headerPattern,
		/^(\w*)(?:\((.*)\))?: (.*)$/
	);
});

test('recursive resolves parser preset from conventional atom', async t => {
	const cwd = await git.bootstrap(
		'fixtures/recursive-parser-preset-conventional-atom'
	);
	// the package file is nested in 2 folders, `npm.bootstrap` cant do that
	await execa('npm', ['install'], {
		cwd: path.resolve(cwd, 'first-extended', 'second-extended')
	});

	const actual = await load({}, {cwd});

	t.is(actual.parserPreset.name, 'conventional-changelog-atom');
	t.is(typeof actual.parserPreset.parserOpts, 'object');
	t.deepEqual(actual.parserPreset.parserOpts.headerPattern, /^(:.*?:) (.*)$/);
});

test('resolves parser preset from conventional commits without factory support', async t => {
	const cwd = await npm.bootstrap(
		'fixtures/parser-preset-conventional-without-factory'
	);
	const actual = await load({}, {cwd});

	t.is(actual.parserPreset.name, 'conventional-changelog-conventionalcommits');
	t.is(typeof actual.parserPreset.parserOpts, 'object');
	t.deepEqual(
		actual.parserPreset.parserOpts.headerPattern,
		/^(\w*)(?:\((.*)\))?!?: (.*)$/
	);
});
