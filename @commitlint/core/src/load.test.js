import path from 'path';
import test from 'ava';

import load from './load';

const cwd = process.cwd();

test.afterEach.always(t => {
	t.context.back();
});

test('extends-empty should have no rules', async t => {
	t.context.back = chdir('fixtures/extends-empty');
	const actual = await load();
	t.deepEqual(actual.rules, {});
});

test('uses seed as configured', async t => {
	t.context.back = chdir('fixtures/extends-empty');
	const actual = await load({rules: {foo: 'bar'}});
	t.is(actual.rules.foo, 'bar');
});

test('uses seed with parserPreset', async t => {
	t.context.back = chdir('fixtures/parser-preset');

	const {parserPreset: actual} = await load({parserPreset: './conventional-changelog-custom'});
	t.is(actual.name, './conventional-changelog-custom');
	t.deepEqual(actual.opts, {
		parserOpts: {
			headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
		}
	});
});

test('invalid extend should throw', t => {
	t.context.back = chdir('fixtures/extends-invalid');
	t.throws(load());
});

test('empty file should have no rules', async t => {
	t.context.back = chdir('fixtures/empty-object-file');
	const actual = await load();
	t.deepEqual(actual.rules, {});
});

test('empty file should extend nothing', async t => {
	t.context.back = chdir('fixtures/empty-file');
	const actual = await load();
	t.deepEqual(actual.extends, []);
});

test('recursive extends', async t => {
	t.context.back = chdir('fixtures/recursive-extends');
	const actual = await load();
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
	t.context.back = chdir('fixtures/parser-preset-override');
	const actual = await load();

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
	t.context.back = chdir('fixtures/recursive-parser-preset');
	const actual = await load();

	t.is(actual.parserPreset.name, './conventional-changelog-custom');
	t.is(typeof actual.parserPreset.opts, 'object');
	t.deepEqual(actual.parserPreset.opts.parserOpts.headerPattern, /^(\w*)(?:\((.*)\))?-(.*)$/);
});

test('ignores unknow keys', async t => {
	t.context.back = chdir('fixtures/trash-file');
	const actual = await load();
	t.deepEqual(actual, {
		extends: [],
		rules: {
			foo: 'bar',
			baz: 'bar'
		}
	});
});

test('ignores unknow keys recursively', async t => {
	t.context.back = chdir('fixtures/trash-extend');
	const actual = await load();
	t.deepEqual(actual, {
		extends: ['./one'],
		rules: {
			zero: 0,
			one: 1
		}
	});
});

test('supports legacy .conventional-changelog-lintrc', async t => {
	t.context.back = chdir('fixtures/legacy');
	const actual = await load();
	t.deepEqual(actual, {
		extends: [],
		rules: {
			legacy: true
		}
	});
});

test('commitlint.config.js overrides .conventional-changelog-lintrc', async t => {
	t.context.back = chdir('fixtures/overriden-legacy');
	const actual = await load();
	t.deepEqual(actual, {
		extends: [],
		rules: {
			legacy: false
		}
	});
});

function chdir(target) {
	const to = path.resolve(cwd, target.split('/').join(path.sep));
	process.chdir(to);
	return () => process.chdir(cwd);
}
