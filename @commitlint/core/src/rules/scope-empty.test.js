import test from 'ava';
import parse from '../library/parse';
import scopeEmpty from './scope-empty';

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

test('with plain message it should succeed for empty keyword', async t => {
	const [actual] = scopeEmpty(await parsed.plain);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('with plain message it should succeed for "never"', async t => {
	const [actual] = scopeEmpty(await parsed.plain, 'never');
	const expected = true;
	t.deepEqual(actual, expected);
});

test('with plain message it should fail for "always"', async t => {
	const [actual] = scopeEmpty(await parsed.plain, 'always');
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with superfluous message it should fail for empty keyword', async t => {
	const [actual] = scopeEmpty(await parsed.superfluous);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with superfluous message it should fail for "never"', async t => {
	const [actual] = scopeEmpty(await parsed.superfluous, 'never');
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with superfluous message it should fail for "always"', async t => {
	const [actual] = scopeEmpty(await parsed.superfluous, 'always');
	const expected = true;
	t.deepEqual(actual, expected);
});

test('with empty message it should fail for empty keyword', async t => {
	const [actual] = scopeEmpty(await parsed.empty);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with empty message it should fail for "never"', async t => {
	const [actual] = scopeEmpty(await parsed.empty, 'never');
	const expected = false;
	t.deepEqual(actual, expected);
});

test('with empty message it should fail for "always"', async t => {
	const [actual] = scopeEmpty(await parsed.empty, 'always');
	const expected = true;
	t.deepEqual(actual, expected);
});
