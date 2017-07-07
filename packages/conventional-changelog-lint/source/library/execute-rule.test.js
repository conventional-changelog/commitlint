import test from 'ava';
import execute from './execute-rule';

test('does nothing without params', async t => {
	const actual = await execute();
	t.is(actual, null);
});

test('returns plain config', async t => {
	const actual = await execute(['name', 'config']);
	t.deepEqual(actual, ['name', 'config']);
});

test('unwraps promised config', async t => {
	const actual = await execute(['name', Promise.resolve('config')]);
	t.deepEqual(actual, ['name', 'config']);
});

test('executes config functions', async t => {
	const actual = await execute(['name', () => 'config']);
	t.deepEqual(actual, ['name', 'config']);
});

test('executes async config functions', async t => {
	const actual = await execute(['name', async () => 'config']);
	t.deepEqual(actual, ['name', 'config']);
});
