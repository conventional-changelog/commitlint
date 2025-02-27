import {test, expect} from 'vitest';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

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

test('returns empty value for empty pnpm repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/empty', __dirname);
	const [, , value] = await fn({cwd});
	expect(value).toEqual([]);
});

test('returns expected value for basic pnpm repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/basic', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['a', 'b']);
});

test('returns expected value for scoped pnpm repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/scoped', __dirname);

	const [, , value] = await fn({cwd});

	expect(value).toEqual(['a', 'b']);
});
