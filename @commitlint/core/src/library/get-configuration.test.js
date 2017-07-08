import path from 'path';
import test from 'ava';

import getConfiguration from './get-configuration';

const cwd = process.cwd();

test.afterEach.always(t => {
	t.context.back();
});

test('overridden-type-enums should return the exact type-enum', async t => {
	t.context.back = chdir('fixtures/overridden-type-enums');
	const actual = await getConfiguration();
	const expected = ['a', 'b', 'c', 'd'];
	t.deepEqual(actual.rules['type-enum'][2], expected);
});

test('extends-empty should have no rules', async t => {
	t.context.back = chdir('fixtures/extends-empty');
	const actual = await getConfiguration();
	t.deepEqual(actual.rules, {});
});

test('invalid extend should throw', t => {
	t.context.back = chdir('fixtures/extends-invalid');
	t.throws(getConfiguration());
});

test('empty file should have no rules', async t => {
	t.context.back = chdir('fixtures/empty-object-file');
	const actual = await getConfiguration();
	t.deepEqual(actual.rules, {});
});

test('empty file should extend nothing', async t => {
	t.context.back = chdir('fixtures/empty-file');
	const actual = await getConfiguration();
	t.deepEqual(actual.extends, []);
});

function chdir(target) {
	const to = path.resolve(cwd, target.split('/').join(path.sep));
	process.chdir(to);
	return () => process.chdir(cwd);
}
