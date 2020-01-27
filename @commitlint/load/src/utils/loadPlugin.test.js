import loadPlugin from './loadPlugin';

beforeEach(() => {
	jest.mock('commitlint-plugin-example', () => ({example: true}), {
		virtual: true
	});
	jest.mock('@scope/commitlint-plugin-example', () => ({scope: true}), {
		virtual: true
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});

test('should load a plugin when referenced by short name', () => {
	const plugins = {};
	loadPlugin(plugins, 'example');
	expect(plugins['example']).toBe(require('commitlint-plugin-example'));
});

test('should load a plugin when referenced by long name', () => {
	const plugins = {};
	loadPlugin(plugins, 'commitlint-plugin-example');
	expect(plugins['example']).toBe(require('commitlint-plugin-example'));
});

test('should throw an error when a plugin has whitespace', () => {
	const plugins = {};
	expect(() => loadPlugin(plugins, 'whitespace ')).toThrow(
		"Whitespace found in plugin name 'whitespace '"
	);
	expect(() => loadPlugin(plugins, 'whitespace\t')).toThrow(
		'Whitespace found in plugin name'
	);
	expect(() => loadPlugin(plugins, 'whitespace\n')).toThrow(
		'Whitespace found in plugin name'
	);
	expect(() => loadPlugin(plugins, 'whitespace\r')).toThrow(
		'Whitespace found in plugin name'
	);
});

test("should throw an error when a plugin doesn't exist", () => {
	const plugins = {};
	expect(() => loadPlugin(plugins, 'nonexistentplugin')).toThrow(
		'Failed to load plugin'
	);
});

test('should load a scoped plugin when referenced by short name', () => {
	const plugins = {};
	loadPlugin(plugins, '@scope/example');
	expect(plugins['@scope/example']).toBe(
		require('@scope/commitlint-plugin-example')
	);
});

test('should load a scoped plugin when referenced by long name', () => {
	const plugins = {};
	loadPlugin(plugins, '@scope/commitlint-plugin-example');
	expect(plugins['@scope/example']).toBe(
		require('@scope/commitlint-plugin-example')
	);
});

/* when referencing a scope plugin and omitting @scope/ */
test("should load a scoped plugin when referenced by short name, but should not get the plugin if '@scope/' is omitted", () => {
	const plugins = {};
	loadPlugin(plugins, '@scope/example');
	expect(plugins['example']).toBe(undefined);
});

test("should load a scoped plugin when referenced by long name, but should not get the plugin if '@scope/' is omitted", () => {
	const plugins = {};
	loadPlugin(plugins, '@scope/commitlint-plugin-example');
	expect(plugins['example']).toBe(undefined);
});
