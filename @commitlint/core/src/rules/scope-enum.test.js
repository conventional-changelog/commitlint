import test from 'ava';
import parse from '../library/parse';
import scopeEnum from './scope-enum';

const messages = {
	plain: 'foo(bar): baz',
	superfluous: 'foo(): baz',
	empty: 'foo: baz'
};

const parsed = {
	plain: parse(messages.plain),
	superfluous: parse(messages.superfluous),
	empty: parse(messages.empty)
};

test('scope-enum with plain message and always should succeed empty enum', async t => {
	const [actual] = scopeEnum(await parsed.plain, 'always', []);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with plain message and never should error empty enum', async t => {
	const [actual] = scopeEnum(await parsed.plain, 'never', []);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with plain message should succeed correct enum', async t => {
	const [actual] = scopeEnum(await parsed.plain, 'always', ['bar']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with plain message should error false enum', async t => {
	const [actual] = scopeEnum(await parsed.plain, 'always', ['foo']);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('scope-enum with plain message should error forbidden enum', async t => {
	const [actual] = scopeEnum(await parsed.plain, 'never', ['bar']);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('scope-enum with plain message should succeed forbidden enum', async t => {
	const [actual] = scopeEnum(await parsed.plain, 'never', ['foo']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with superfluous scope should succeed enum', async t => {
	const [actual] = scopeEnum(await parsed.superfluous, 'always', ['bar']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with superfluous scope and "never" should succeed', async t => {
	const [actual] = scopeEnum(await parsed.superfluous, 'never', ['bar']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with superfluous scope and always should succeed empty enum', async t => {
	const [actual] = scopeEnum(await parsed.superfluous, 'always', []);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with superfluous scope and never should succeed empty enum', async t => {
	const [actual] = scopeEnum(await parsed.superfluous, 'never', []);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with empty scope and always should succeed empty enum', async t => {
	const [actual] = scopeEnum(await parsed.superfluous, 'always', []);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with empty scope and always should succeed filled enum', async t => {
	const [actual] = scopeEnum(await parsed.superfluous, 'always', ['foo']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with empty scope and never should succeed empty enum', async t => {
	const [actual] = scopeEnum(await parsed.superfluous, 'never', []);
	const expected = true;
	t.deepEqual(actual, expected);
});
