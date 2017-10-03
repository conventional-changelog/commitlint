import test from 'ava';

import {bootstrap} from './test-git';
import load from './load';

test('extends-empty should have no rules', async t => {
	const cwd = await bootstrap('fixtures/extends-empty');
	const actual = await load({}, {cwd});
	t.deepEqual(actual.rules, {});
});

test('uses seed as configured', async t => {
	const cwd = await bootstrap('fixtures/extends-empty');
	const actual = await load({rules: {foo: 'bar'}}, {cwd});
	t.is(actual.rules.foo, 'bar');
});

test('uses seed with parserPreset', async t => {
	const cwd = await bootstrap('fixtures/parser-preset');
	const {parserPreset: actual} = await load(
		{
			parserPreset: './conventional-changelog-custom'
		},
		{cwd}
	);

	t.is(actual.name, './conventional-changelog-custom');
	t.deepEqual(actual.opts, {
		parserOpts: {
			headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
		}
	});
});

test('invalid extend should throw', async t => {
	const cwd = await bootstrap('fixtures/extends-invalid');
	await t.throws(load({}, {cwd}));
});

test('empty file should have no rules', async t => {
	const cwd = await bootstrap('fixtures/empty-object-file');
	const actual = await load({}, {cwd});
	t.deepEqual(actual.rules, {});
});

test('empty file should extend nothing', async t => {
	const cwd = await bootstrap('fixtures/empty-file');
	const actual = await load({}, {cwd});
	t.deepEqual(actual.extends, []);
});

test('respects cwd option', async t => {
	const cwd = await bootstrap('fixtures/recursive-extends/first-extended');
	const actual = await load({}, {cwd});
	t.deepEqual(actual, {
		extends: ['./second-extended'],
		rules: {
			one: 1,
			two: 2
		}
	});
});

test('recursive extends', async t => {
	const cwd = await bootstrap('fixtures/recursive-extends');
	const actual = await load({}, {cwd});
	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('recursive extends with json file', async t => {
	const cwd = await bootstrap('fixtures/recursive-extends-json');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('recursive extends with yaml file', async t => {
	const cwd = await bootstrap('fixtures/recursive-extends-yaml');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('recursive extends with js file', async t => {
	const cwd = await bootstrap('fixtures/recursive-extends-js');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('recursive extends with package.json file', async t => {
	const cwd = await bootstrap('fixtures/recursive-extends-package');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		extends: ['./first-extended'],
		rules: {
			zero: 0,
			one: 1,
			two: 2
		}
	});
});

test('parser preset overwrites completely instead of merging', async t => {
	const cwd = await bootstrap('fixtures/parser-preset-override');
	const actual = await load({}, {cwd});

	t.is(actual.parserPreset.name, './custom');
	t.is(typeof actual.parserPreset.opts, 'object');
	t.deepEqual(actual.parserPreset.opts, {
		b: 'b',
		parserOpts: {
			headerPattern: /.*/
		}
	});
});

test('recursive extends with parserPreset', async t => {
	const cwd = await bootstrap('fixtures/recursive-parser-preset');
	const actual = await load({}, {cwd});

	t.is(actual.parserPreset.name, './conventional-changelog-custom');
	t.is(typeof actual.parserPreset.opts, 'object');
	t.deepEqual(
		actual.parserPreset.opts.parserOpts.headerPattern,
		/^(\w*)(?:\((.*)\))?-(.*)$/
	);
});

test('ignores unknow keys', async t => {
	const cwd = await bootstrap('fixtures/trash-file');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		extends: [],
		rules: {
			foo: 'bar',
			baz: 'bar'
		}
	});
});

test('ignores unknow keys recursively', async t => {
	const cwd = await bootstrap('fixtures/trash-extend');
	const actual = await load({}, {cwd});

	t.deepEqual(actual, {
		extends: ['./one'],
		rules: {
			zero: 0,
			one: 1
		}
	});
});
