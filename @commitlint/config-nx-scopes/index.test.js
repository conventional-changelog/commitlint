import path from 'path';
import {fileURLToPath} from 'url';

import {npm} from '@commitlint/test';

import config from './index.js';

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..');

test('exports rules key', () => {
	expect(config).toHaveProperty('rules');
});

test('rules hold object', () => {
	expect(config).toMatchObject({
		rules: expect.any(Object),
	});
});

test('rules contain scope-enum', () => {
	expect(config).toMatchObject({
		rules: {
			'scope-enum': expect.anything(),
		},
	});
});

test('scope-enum is function', () => {
	expect(config).toMatchObject({
		rules: {
			'scope-enum': expect.any(Function),
		},
	});
});

test('scope-enum does not throw for missing context', async () => {
	const {'scope-enum': fn} = config.rules;
	await expect(fn()).resolves.toBeTruthy();
});

test('scope-enum has expected severity', async () => {
	const {'scope-enum': fn} = config.rules;
	const [severity] = await fn();
	expect(severity).toBe(2);
});

test('scope-enum has expected modifier', async () => {
	const {'scope-enum': fn} = config.rules;
	const [, modifier] = await fn();
	expect(modifier).toBe('always');
});

test('returns empty value for empty nx repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/empty', __dirname);
	const [, , value] = await fn({cwd});
	expect(value).toEqual([]);
});

test('returns expected value for basic nx repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/basic', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['a', 'b']);
});

test('expect correct result from Nx 14', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/nx14', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['c', 'd']);
});

test('expect correct result from Nx 15', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/nx15', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['e', 'f']);
});

test('expect correct result from Nx 17', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/nx17', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['g', 'h']);
});
