import test from 'ava';
import parse from '../library/parse';
import typeEmpty from './type-empty';

const messages = {
	empty: '(scope):',
	filled: 'type: subject'
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled)
};

test('without type should succeed for empty keyword', async t => {
	const [actual] = typeEmpty(await parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('without type should fail for "never"', async t => {
	const [actual] = typeEmpty(await parsed.empty, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('without type should succeed for "always"', async t => {
	const [actual] = typeEmpty(await parsed.empty, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with type fail for empty keyword', async t => {
	const [actual] = typeEmpty(await parsed.filled);
	const expected = false;
	t.is(actual, expected);
});

test('with type succeed for "never"', async t => {
	const [actual] = typeEmpty(await parsed.filled, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with type fail for "always"', async t => {
	const [actual] = typeEmpty(await parsed.filled, 'always');
	const expected = false;
	t.is(actual, expected);
});
