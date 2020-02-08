import {lerna} from '@commitlint/test';
import config from '.';
import semver from 'semver';

test('exports rules key', () => {
	expect(config).toHaveProperty('rules');
});

test('rules hold object', () => {
	expect(config).toMatchObject({
		rules: expect.any(Object)
	});
});

test('rules contain scope-enum', () => {
	expect(config).toMatchObject({
		rules: {
			'scope-enum': expect.anything()
		}
	});
});

test('scope-enum is function', () => {
	expect(config).toMatchObject({
		rules: {
			'scope-enum': expect.any(Function)
		}
	});
});

test('scope-enum does not throw for missing context', async () => {
	const semverLt = jest.spyOn(semver, 'lt');
	const {'scope-enum': fn} = config.rules;
	await expect(fn()).resolves.toBeTruthy();
	expect(semverLt).toHaveLastReturnedWith(false);
});

test('scope-enum has expected severity', async () => {
	const semverLt = jest.spyOn(semver, 'lt');
	const {'scope-enum': fn} = config.rules;
	const [severity] = await fn();
	expect(severity).toBe(2);
	expect(semverLt).toHaveLastReturnedWith(false);
});

test('scope-enum has expected modifier', async () => {
	const semverLt = jest.spyOn(semver, 'lt');
	const {'scope-enum': fn} = config.rules;
	const [, modifier] = await fn();
	expect(modifier).toBe('always');
	expect(semverLt).toHaveLastReturnedWith(false);
});

test('returns empty value for empty lerna repository', async () => {
	const semverLt = jest.spyOn(semver, 'lt');
	const {'scope-enum': fn} = config.rules;
	const cwd = await lerna.bootstrap('empty', __dirname);
	const [, , value] = await fn({cwd});
	expect(value).toEqual([]);
	expect(semverLt).toHaveLastReturnedWith(false);
});

test('returns expected value for basic lerna repository', async () => {
	const semverLt = jest.spyOn(semver, 'lt');
	const {'scope-enum': fn} = config.rules;
	const cwd = await lerna.bootstrap('basic', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['a', 'b']);
	expect(semverLt).toHaveLastReturnedWith(false);
});

test('returns expected value for scoped lerna repository', async () => {
	const semverLt = jest.spyOn(semver, 'lt');
	const {'scope-enum': fn} = config.rules;
	const cwd = await lerna.bootstrap('scoped', __dirname);

	const [, , value] = await fn({cwd});
	expect(value).toEqual(['a', 'b']);
	expect(semverLt).toHaveLastReturnedWith(false);
});

test('works with lerna version < 3', async () => {
	const semverLt = jest.spyOn(semver, 'lt');
	const {'scope-enum': fn} = config.rules;
	const cwd = await lerna.bootstrap('lerna-two', __dirname);
	await expect(fn({cwd})).resolves.toBeTruthy();
	expect(semverLt).toHaveBeenLastCalledWith('2.11.0', '3.0.0');
	expect(semverLt).toHaveLastReturnedWith(true);
});
