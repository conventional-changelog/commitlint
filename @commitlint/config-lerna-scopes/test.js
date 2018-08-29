import {npm} from '@commitlint/test';
import test from 'ava';
import config from '.';

test('exports rules key', t => {
	t.true(Object.prototype.hasOwnProperty.call(config, 'rules'));
});

test('rules hold object', t => {
	t.is(typeof config.rules, 'object');
});

test('rules contain scope-enum', t => {
	t.true(Object.prototype.hasOwnProperty.call(config.rules, 'scope-enum'));
});

test('scope-enum is function', t => {
	const {'scope-enum': fn} = config.rules;
	t.is(typeof fn, 'function');
});

test('scope-enum does not throw for missing context', async t => {
	const {'scope-enum': fn} = config.rules;
	try {
		await fn();
		t.pass();
	} catch (err) {
		t.fail();
	}
});

test('scope-enum has expected severity', async t => {
	const {'scope-enum': fn} = config.rules;
	const [severity] = await fn();
	t.is(severity, 2);
});

test('scope-enum has expected modifier', async t => {
	const {'scope-enum': fn} = config.rules;
	const [, modifier] = await fn();
	t.is(modifier, 'always');
});

test('returns empty value for empty lerna repository', async t => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/empty');
	const [, , value] = await fn({cwd});
	t.deepEqual(value, []);
});

test('returns expected value for basic lerna repository', async t => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/basic');
	const [, , value] = await fn({cwd});
	t.deepEqual(value, ['a', 'b']);
});

test('returns expected value for scoped lerna repository', async t => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/scoped');
	const [, , value] = await fn({cwd});
	t.deepEqual(value, ['a', 'b']);
});

test('works with lerna version < 3', async t => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/lerna-two');
	await t.notThrows(async () => fn({cwd}));
});
