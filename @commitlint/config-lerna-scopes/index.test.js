import {npm} from '@commitlint/test';
import config from '.';

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
}, 30000);

test('returns expected value for basic lerna repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/basic', __dirname);
	const [, , value] = await fn({cwd});
	expect(value).toEqual(['a', 'b']);
}, 30000);

test('returns expected value for scoped lerna repository', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/scoped', __dirname);
	const [, , value] = await fn({cwd});
	expect(value).toEqual(['a', 'b']);
}, 30000);

test('works with lerna version < 3', async () => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/lerna-two', __dirname);
	await expect(fn({cwd})).resolves.toBeTruthy();
}, 30000);
