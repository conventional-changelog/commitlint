const commitlintPluginExample = jest.fn();
const scopedCommitlintPluginExample = jest.fn();

jest.mock('commitlint-plugin-example', () => commitlintPluginExample, {
	virtual: true
});
jest.mock(
	'@scope/commitlint-plugin-example',
	() => scopedCommitlintPluginExample,
	{virtual: true}
);

import loadPlugin from './loadPlugin';

test('should load a plugin when referenced by short name', () => {
	const plugins: any = {};
	loadPlugin(plugins, 'example');
	expect(plugins['example']).toBe(commitlintPluginExample);
});

test('should load a plugin when referenced by long name', () => {
	const plugins: any = {};
	loadPlugin(plugins, 'commitlint-plugin-example');
	expect(plugins['example']).toBe(commitlintPluginExample);
});

test('should throw an error when a plugin has whitespace', () => {
	const plugins: any = {};
	expect(() => loadPlugin(plugins, 'whitespace ')).toThrow(
		/Whitespace found in plugin name 'whitespace '/u
	);
	expect(() => loadPlugin(plugins, 'whitespace\t')).toThrow(
		/Whitespace found in plugin name/u
	);
	expect(() => loadPlugin(plugins, 'whitespace\n')).toThrow(
		/Whitespace found in plugin name/u
	);
	expect(() => loadPlugin(plugins, 'whitespace\r')).toThrow(
		/Whitespace found in plugin name/u
	);
});

test("should throw an error when a plugin doesn't exist", () => {
	const plugins: any = {};
	expect(() => loadPlugin(plugins, 'nonexistentplugin')).toThrow(
		/Failed to load plugin/u
	);
});

test('should load a scoped plugin when referenced by short name', () => {
	const plugins: any = {};
	loadPlugin(plugins, '@scope/example');
	expect(plugins['@scope/example']).toBe(scopedCommitlintPluginExample);
});

test('should load a scoped plugin when referenced by long name', () => {
	const plugins: any = {};
	loadPlugin(plugins, '@scope/commitlint-plugin-example');
	expect(plugins['@scope/example']).toBe(scopedCommitlintPluginExample);
});

/* when referencing a scope plugin and omitting @scope/ */
test("should load a scoped plugin when referenced by short name, but should not get the plugin if '@scope/' is omitted", () => {
	const plugins: any = {};
	loadPlugin(plugins, '@scope/example');
	expect(plugins['example']).toBeUndefined();
});

test("should load a scoped plugin when referenced by long name, but should not get the plugin if '@scope/' is omitted", () => {
	const plugins: any = {};
	loadPlugin(plugins, '@scope/commitlint-plugin-example');
	expect(plugins['example']).toBeUndefined();
});
