import test from 'ava';
import parse from '../../source/library/parse';
import scopeEnum from '../../source/rules/scope-enum';

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

test('scope-enum with plain message and always should succeed empty enum', t => {
	const [actual] = scopeEnum(parsed.plain, 'always', []);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with plain message and never should error empty enum', t => {
	const [actual] = scopeEnum(parsed.plain, 'never', []);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('scope-enum with plain message should succeed correct enum', t => {
	const [actual] = scopeEnum(parsed.plain, 'always', ['bar']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with plain message should error false enum', t => {
	const [actual] = scopeEnum(parsed.plain, 'always', ['foo']);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('scope-enum with plain message should error forbidden enum', t => {
	const [actual] = scopeEnum(parsed.plain, 'never', ['bar']);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('scope-enum with plain message should succeed forbidden enum', t => {
	const [actual] = scopeEnum(parsed.plain, 'never', ['foo']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with superfluous scope should succeed enum', t => {
	const [actual] = scopeEnum(parsed.superfluous, 'always', ['bar']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with superfluous scope and "never" should succeed', t => {
	const [actual] = scopeEnum(parsed.superfluous, 'never', ['bar']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with superfluous scope and always should succeed empty enum', t => {
	const [actual] = scopeEnum(parsed.superfluous, 'always', []);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with superfluous scope and never should succeed empty enum', t => {
	const [actual] = scopeEnum(parsed.superfluous, 'never', []);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with empty scope and always should succeed empty enum', t => {
	const [actual] = scopeEnum(parsed.superfluous, 'always', []);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with empty scope and always should succeed filled enum', t => {
	const [actual] = scopeEnum(parsed.superfluous, 'always', ['foo']);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('scope-enum with empty scope and never should succeed empty enum', t => {
	const [actual] = scopeEnum(parsed.superfluous, 'never', []);
	const expected = true;
	t.deepEqual(actual, expected);
});
