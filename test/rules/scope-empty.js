import test from 'ava';
import parse from '../../source/library/parse';
import scopeEmpty from '../../source/rules/scope-empty';

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

test('with plain message it should succeed for empty keyword', t => {
	const [actual] = scopeEmpty(parsed.plain);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('with plain message it should succeed for "never"', t => {
	const [actual] = scopeEmpty(parsed.plain, 'never');
	const expected = true;
	t.deepEqual(actual, expected);
});

test('with plain message it should fail for "always"', t => {
	const [actual] = scopeEmpty(parsed.plain, 'always');
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with superfluous message it should fail for empty keyword', t => {
	const [actual] = scopeEmpty(parsed.superfluous);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with superfluous message it should fail for "never"', t => {
	const [actual] = scopeEmpty(parsed.superfluous, 'never');
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with superfluous message it should fail for "always"', t => {
	const [actual] = scopeEmpty(parsed.superfluous, 'always');
	const expected = true;
	t.deepEqual(actual, expected);
});

test('with empty message it should fail for empty keyword', t => {
	const [actual] = scopeEmpty(parsed.empty);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with empty message it should fail for "never"', t => {
	const [actual] = scopeEmpty(parsed.empty, 'never');
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with empty message it should fail for "always"', t => {
	const [actual] = scopeEmpty(parsed.empty, 'always');
	const expected = true;
	t.deepEqual(actual, expected);
});
