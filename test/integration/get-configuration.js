import path from 'path';
import test from 'ava';
import expect from 'unexpected';

import getConfiguration from '../../source/library/get-configuration';

const cwd = process.cwd();

test('overridden-type-enums should return the exact type-enum', async t => {
	const back = chdir('fixtures/overridden-type-enums');
	const actual = await getConfiguration();
	expect(actual.rules['type-enum'][2], 'to equal', [ "a", "b", "c", "d" ]);
	back();
});

test('overridden-extended-type-enums should return the exact type-enum', async t => {
	const back = chdir('fixtures/overridden-extended-type-enums');
	const actual = await getConfiguration();
	expect(actual.rules['type-enum'][2], 'to equal', [ "a", "b", "c", "d" ]);
	back();
});

test('extends-empty should have no rules', async t => {
	const back = chdir('fixtures/extends-empty');
	const actual = await getConfiguration();
	expect(actual.rules, 'to equal', {});
	back();
});

test('invalid extend should throw', async t => {
	const back = chdir('fixtures/extends-invalid');
	t.throws(getConfiguration(), Error);
	back();
});

test('empty file should have no rules', async t => {
	const back = chdir('fixtures/empty-object-file');
	const actual = await getConfiguration();
	expect(actual.rules, 'to equal', {});
	back();
});

test('empty file should extend angular', async t => {
	const back = chdir('fixtures/empty-file');
	const actual = await getConfiguration();
	expect(actual.extends, 'to equal', ['angular']);
	back();
});

function chdir(target) {
	const to = path.resolve(cwd, target.split('/').join(path.sep));
	process.chdir(to);
	return () => process.chdir(cwd);
}
