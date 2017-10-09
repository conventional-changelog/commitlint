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

test('scope-enum does not throw for missing context', t => {
	const {'scope-enum': fn} = config.rules;
	t.notThrows(() => fn());
});

test('scope-enum has expected severity', t => {
	const {'scope-enum': fn} = config.rules;
	const [severity] = fn();
	t.is(severity, 2);
});

test('scope-enum has expected modifier', t => {
	const {'scope-enum': fn} = config.rules;
	const [, modifier] = fn();
	t.is(modifier, 'always');
});

test('returns empty value for empty lerna repository', async t => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/empty');
	const [, , value] = fn({cwd});
	t.deepEqual(value, []);
});

test('returns expected value for basic lerna repository', async t => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/basic');
	const [, , value] = fn({cwd});
	t.deepEqual(value, ['a', 'b']);
});

test.failing(
	'throws for repository with .lerna vs .devDependencies.lerna mismatch',
	async t => {
		const {'scope-enum': fn} = config.rules;
		const cwd = await npm.bootstrap('fixtures/version-mismatch');
		await t.throws(() => fn({cwd}));
	}
);

test('returns expected value for scoped lerna repository', async t => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/scoped');
	const [, , value] = fn({cwd});
	t.deepEqual(value, ['a', 'b']);
});

test('works with lerna 2.0', async t => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/lerna-2.4');
	const [, , value] = fn({cwd});
	t.deepEqual(value, ['a', 'b']);
});

test('works with lerna 2.4', async t => {
	const {'scope-enum': fn} = config.rules;
	const cwd = await npm.bootstrap('fixtures/lerna-2.4');
	const [, , value] = fn({cwd});
	t.deepEqual(value, ['a', 'b']);
});
