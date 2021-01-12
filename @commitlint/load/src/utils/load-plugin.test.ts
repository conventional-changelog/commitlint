import loadPlugin from './load-plugin';
import {platform} from 'os';
import chalk from 'chalk';

jest.mock('commitlint-plugin-example', () => ({example: true}), {
	virtual: true,
});

jest.mock('@scope/commitlint-plugin-example', () => ({scope: true}), {
	virtual: true,
});

jest.mock('./relative/posix.js', () => ({relativePosix: true}), {
	virtual: true,
});

jest.mock('/absolute/posix.js', () => ({relativePosix: true}), {
	virtual: true,
});

jest.mock('.\\relative\\windows.js', () => ({relativePosix: true}), {
	virtual: true,
});

jest.mock('C:\\absolute\\windows.js', () => ({relativePosix: true}), {
	virtual: true,
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
	const spy = jest.spyOn(console, 'error').mockImplementation();
	expect(() => loadPlugin({}, 'nonexistentplugin')).toThrow(
		'Failed to load plugin'
	);
	expect(spy).toBeCalledWith(
		chalk.red(`Failed to load plugin commitlint-plugin-nonexistentplugin.`)
	);
	spy.mockRestore();
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

test('should load a plugin when relative posix path is provided', () => {
	const plugins = loadPlugin({}, './relative/posix.js');
	expect(plugins['posix.js']).toBe(require('./relative/posix.js'));
});

test('should load a plugin when absolute posix path is provided', () => {
	const plugins = loadPlugin({}, '/absolute/posix.js');
	// eslint-disable-next-line import/no-absolute-path
	expect(plugins['posix.js']).toBe(require('/absolute/posix.js'));
});

if (platform() === 'win32') {
	test('should load a plugin when relative windows path is provided', () => {
		const plugins = loadPlugin({}, '.\\relative\\windows.js');
		expect(plugins['windows.js']).toBe(require('.\\relative\\windows.js'));
	});

	test('should load a plugin when absolute windows path is provided', () => {
		const plugins = loadPlugin({}, 'C:\\absolute\\windows.js');
		// eslint-disable-next-line import/no-absolute-path
		expect(plugins['windows.js']).toBe(require('C:\\absolute\\windows.js'));
	});
} else {
	test('should not load a plugin when absolute windows path is provided', () => {
		const spy = jest.spyOn(console, 'error').mockImplementation();
		expect(() => loadPlugin({}, 'C:\\absolute\\windows.js')).toThrow(
			'Failed to load plugin'
		);
		expect(spy).toBeCalledWith(
			chalk.red(
				`Failed to load plugin commitlint-plugin-C:/absolute/windows.js.`
			)
		);
		spy.mockRestore();
	});
}
