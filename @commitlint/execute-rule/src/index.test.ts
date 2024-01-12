import execute from './index.js';

test('does nothing without params', async () => {
	const exec = execute as any;
	expect(await exec()).toBeNull();
});

test('returns plain config', async () => {
	const actual = await execute(['name', 'config']);
	expect(actual).toEqual(['name', 'config']);
});

test('unwraps promised config', async () => {
	const actual = await execute(['name', Promise.resolve('config')]);
	expect(actual).toEqual(['name', 'config']);
});

test('executes config functions', async () => {
	const actual = await execute(['name', () => 'config']);
	expect(actual).toEqual(['name', 'config']);
});

test('executes async config functions', async () => {
	const actual = await execute(['name', async () => 'config']);
	expect(actual).toEqual(['name', 'config']);
});
