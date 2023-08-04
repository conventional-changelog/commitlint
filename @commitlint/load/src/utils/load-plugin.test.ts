import loadPlugin from './load-plugin';
import {AsyncRule, Plugin, Rule, SyncRule} from '@commitlint/types';

jest.mock('commitlint-plugin-example', () => ({example: true}), {
	virtual: true,
});

jest.mock('@scope/commitlint-plugin-example', () => ({scope: true}), {
	virtual: true,
});

jest.mock(
	'commitlint-plugin-rule',
	(): Plugin => {
		const rule: Rule<number> = (_parsed, when, _value) => {
			return [when === 'never'];
		};
		return {rules: {rule}};
	},
	{virtual: true},
);

jest.mock(
	'commitlint-plugin-sync-rule',
	(): Plugin => {
		const syncRule: SyncRule<number> = (_parsed, when, _value) => {
			return [when === 'never'];
		};
		return {rules: {syncRule}};
	},
	{virtual: true},
);

jest.mock(
	'commitlint-plugin-async-rule',
	(): Plugin => {
		const asyncRule: AsyncRule<number> = (_parsed, when, _value) => {
			return new Promise(() => [when === 'never']);
		};
		return {rules: {asyncRule}};
	},
	{virtual: true},
);

test('should load a plugin when referenced by short name', () => {
	const plugins = loadPlugin({}, 'example');
	expect(plugins['example']).toBe(require('commitlint-plugin-example'));
});

test('should load a plugin when referenced by long name', () => {
	const plugins = loadPlugin({}, 'commitlint-plugin-example');
	expect(plugins['example']).toBe(require('commitlint-plugin-example'));
});

test('should load a plugin with a rule', () => {
	const plugins = loadPlugin({}, 'commitlint-plugin-rule');
	expect(plugins['rule']).toBe(require('commitlint-plugin-rule'));
});

test('should load a plugin with a sync rule', () => {
	const plugins = loadPlugin({}, 'commitlint-plugin-sync-rule');
	expect(plugins['sync-rule']).toBe(require('commitlint-plugin-sync-rule'));
});

test('should load a plugin with an async rule', () => {
	const plugins = loadPlugin({}, 'commitlint-plugin-async-rule');
	expect(plugins['async-rule']).toBe(require('commitlint-plugin-async-rule'));
});

test('should throw an error when a plugin has whitespace', () => {
	expect(() => loadPlugin({}, 'whitespace ')).toThrow(
		"Whitespace found in plugin name 'whitespace '",
	);
	expect(() => loadPlugin({}, 'whitespace\t')).toThrow(
		'Whitespace found in plugin name',
	);
	expect(() => loadPlugin({}, 'whitespace\n')).toThrow(
		'Whitespace found in plugin name',
	);
	expect(() => loadPlugin({}, 'whitespace\r')).toThrow(
		'Whitespace found in plugin name',
	);
});

test("should throw an error when a plugin doesn't exist", () => {
	expect(() => loadPlugin({}, 'nonexistentplugin')).toThrow(
		'Failed to load plugin',
	);
});

test('should load a scoped plugin when referenced by short name', () => {
	const plugins = loadPlugin({}, '@scope/example');
	expect(plugins['@scope/example']).toBe(
		require('@scope/commitlint-plugin-example'),
	);
});

test('should load a scoped plugin when referenced by long name', () => {
	const plugins = loadPlugin({}, '@scope/commitlint-plugin-example');
	expect(plugins['@scope/example']).toBe(
		require('@scope/commitlint-plugin-example'),
	);
});

/* when referencing a scope plugin and omitting @scope/ */
test("should load a scoped plugin when referenced by short name, but should not get the plugin if '@scope/' is omitted", () => {
	const plugins = loadPlugin({}, '@scope/example');
	expect(plugins['example']).toBe(undefined);
});

test("should load a scoped plugin when referenced by long name, but should not get the plugin if '@scope/' is omitted", () => {
	const plugins = loadPlugin({}, '@scope/commitlint-plugin-example');
	expect(plugins['example']).toBe(undefined);
});
