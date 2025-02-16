import {test, expect, vi} from 'vitest';
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

test('returns empty value for empty lerna repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/empty', __dirname);
	const [, , value] = await fn({cwd});
	expect(value).toEqual([]);
});

test('returns all packages for nested lerna packages repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/nested', __dirname);
	const [, , value] = await fn({cwd});
	expect(value).toEqual(['nested-a', 'nested-b', 'nested-c']);
});

test('returns expected value for basic lerna repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/basic', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['basic-a', 'basic-b']);
});

test('returns expected value for lerna repository containing modules', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/modules', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['modules-a']);
});

test('returns expected value for scoped lerna repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/scoped', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['scoped-a', 'scoped-b']);
});

test('work with no declared packages', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap(
		'fixtures/no-packages-declaration',
		__dirname
	);

	const [, , value] = await fn({cwd});
	expect(value).toEqual([]);
});

test('inform the user about the transition to config-workspace-scopes if the project is using native workspaces', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap(
		'fixtures/transition-to-workspace-scopes',
		__dirname
	);

	const consoleWarnSpy = vi.spyOn(console, 'warn');

	const [, , value] = await fn({cwd});

	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringContaining(`It seems that you are using npm/yarn workspaces`)
	);

	expect(value).toEqual(['workspace-package']);
});
