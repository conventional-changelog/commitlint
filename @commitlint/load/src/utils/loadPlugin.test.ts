import loadPlugin from './loadPlugin';

jest.mock('commitlint-plugin-example', () => ({example: true}), {
	virtual: true
});

jest.mock('@scope/commitlint-plugin-example', () => ({scope: true}), {
	virtual: true
});

test('should load a plugin when referenced by short name', () => {
	const plugins = loadPlugin({}, 'example');
	expect(plugins['example']).toBe(require('commitlint-plugin-example'));
});

test('should load a plugin when referenced by long name', () => {
	const plugins = loadPlugin({}, 'commitlint-plugin-example');
	expect(plugins['example']).toBe(require('commitlint-plugin-example'));
});

test('should throw an error when a plugin has whitespace', () => {
	expect(() => loadPlugin({}, 'whitespace ')).toThrow(
		"Whitespace found in plugin name 'whitespace '"
	);
	expect(() => loadPlugin({}, 'whitespace\t')).toThrow(
		'Whitespace found in plugin name'
	);
	expect(() => loadPlugin({}, 'whitespace\n')).toThrow(
		'Whitespace found in plugin name'
	);
	expect(() => loadPlugin({}, 'whitespace\r')).toThrow(
		'Whitespace found in plugin name'
	);
});

test("should throw an error when a plugin doesn't exist", () => {
	expect(() => loadPlugin({}, 'nonexistentplugin')).toThrow(
		'Failed to load plugin'
	);
});

test('should load a scoped plugin when referenced by short name', () => {
	const plugins = loadPlugin({}, '@scope/example');
	expect(plugins['@scope/example']).toBe(
		require('@scope/commitlint-plugin-example')
	);
});

test('should load a scoped plugin when referenced by long name', () => {
	const plugins = loadPlugin({}, '@scope/commitlint-plugin-example');
	expect(plugins['@scope/example']).toBe(
		require('@scope/commitlint-plugin-example')
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
