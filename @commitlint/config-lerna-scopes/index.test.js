import {lerna} from '@commitlint/test';
import config from '.';
import semver from 'semver';

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
	const cwd = await lerna.bootstrap('empty', __dirname);
	const [, , value] = await fn({cwd});
	expect(value).toEqual([]);
});

test('returns expected value for basic lerna repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await lerna.bootstrap('basic', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['a', 'b']);
});

test('returns expected value for scoped lerna repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await lerna.bootstrap('scoped', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['a', 'b']);
});

test('works with lerna version < 3', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await lerna.bootstrap('lerna-two', __dirname);
	const [, , value] = await fn({cwd});
	expect(value).toEqual(['a2', 'b2']);
});

test('uses lerna version < 3 if installed', async () => {
	const semverLt = jest.spyOn(semver, 'lt');
	const cwd = await lerna.bootstrap('lerna-two', __dirname);
	const packages = await config.utils.getPackages({cwd});

	expect(packages).toEqual(['a2', 'b2']);
	expect(semverLt).toHaveBeenLastCalledWith('2.11.0', '3.0.0');
	expect(semverLt).toHaveLastReturnedWith(true);
});

test('uses lerna version >= 3 if installed', async () => {
	const semverLt = jest.spyOn(semver, 'lt');
	const cwd = await lerna.bootstrap('basic', __dirname);

	const packages = await config.utils.getPackages({cwd});

	expect(packages).toEqual(['a', 'b']);
	expect(semverLt).toHaveBeenLastCalledWith('3.20.2', '3.0.0');
	expect(semverLt).toHaveLastReturnedWith(false);
});
