import {AsyncRule, Plugin, Rule, SyncRule} from '@commitlint/types';

import loadPlugin from './load-plugin.js';

vi.mock('commitlint-plugin-example', () => ({example: true}));

vi.mock('@scope/commitlint-plugin-example', () => ({scope: true}));

vi.mock('commitlint-plugin-rule', (): Plugin => {
	const rule: Rule<number> = (_parsed, when, _value) => {
		return [when === 'never'];
	};
	return {rules: {rule}};
});

vi.mock('commitlint-plugin-sync-rule', (): Plugin => {
	const syncRule: SyncRule<number> = (_parsed, when, _value) => {
		return [when === 'never'];
	};
	return {rules: {syncRule}};
});

vi.mock('commitlint-plugin-async-rule', (): Plugin => {
	const asyncRule: AsyncRule<number> = (_parsed, when, _value) => {
		return new Promise(() => [when === 'never']);
	};
	return {rules: {asyncRule}};
});

test('should load a plugin when referenced by short name', async () => {
	const plugins = await loadPlugin({}, 'example');
	expect(plugins['example']).toBe(
		// @ts-expect-error -- mocked module
		await import('commitlint-plugin-example')
	);
});

test('should load a plugin when referenced by long name', async () => {
	const plugins = await loadPlugin({}, 'commitlint-plugin-example');
	expect(plugins['example']).toBe(
		// @ts-expect-error -- mocked module
		await import('commitlint-plugin-example')
	);
});

test('should load a plugin with a rule', async () => {
	const plugins = await loadPlugin({}, 'commitlint-plugin-rule');
	expect(plugins['rule']).toBe(
		// @ts-expect-error -- mocked module
		await import('commitlint-plugin-rule')
	);
});

test('should load a plugin with a sync rule', async () => {
	const plugins = await loadPlugin({}, 'commitlint-plugin-sync-rule');
	expect(plugins['sync-rule']).toBe(
		// @ts-expect-error -- mocked module
		await import('commitlint-plugin-sync-rule')
	);
});

test('should load a plugin with an async rule', async () => {
	const plugins = await loadPlugin({}, 'commitlint-plugin-async-rule');
	expect(plugins['async-rule']).toBe(
		// @ts-expect-error -- mocked module
		await import('commitlint-plugin-async-rule')
	);
});

test('should throw an error when a plugin has whitespace', async () => {
	await expect(() => loadPlugin({}, 'whitespace ')).rejects.toThrow(
		"Whitespace found in plugin name 'whitespace '"
	);
	await expect(() => loadPlugin({}, 'whitespace\t')).rejects.toThrow(
		'Whitespace found in plugin name'
	);
	await expect(() => loadPlugin({}, 'whitespace\n')).rejects.toThrow(
		'Whitespace found in plugin name'
	);
	await expect(() => loadPlugin({}, 'whitespace\r')).rejects.toThrow(
		'Whitespace found in plugin name'
	);
});

test("should throw an error when a plugin doesn't exist", () =>
	expect(() => loadPlugin({}, 'nonexistentplugin')).rejects.toThrow(
		'Failed to load plugin'
	));

test('should load a scoped plugin when referenced by short name', async () => {
	const plugins = await loadPlugin({}, '@scope/example');
	expect(plugins['@scope/example']).toBe(
		// @ts-expect-error -- mocked module
		await import('@scope/commitlint-plugin-example')
	);
});

test('should load a scoped plugin when referenced by long name', async () => {
	const plugins = await loadPlugin({}, '@scope/commitlint-plugin-example');
	expect(plugins['@scope/example']).toBe(
		// @ts-expect-error -- mocked module
		await import('@scope/commitlint-plugin-example')
	);
});

/* when referencing a scope plugin and omitting @scope/ */
test("should load a scoped plugin when referenced by short name, but should not get the plugin if '@scope/' is omitted", async () => {
	const plugins = await loadPlugin({}, '@scope/example');
	expect(plugins['example']).toBeUndefined();
});

test("should load a scoped plugin when referenced by long name, but should not get the plugin if '@scope/' is omitted", async () => {
	const plugins = await loadPlugin({}, '@scope/commitlint-plugin-example');
	expect(plugins['example']).toBeUndefined();
});
