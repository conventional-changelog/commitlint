import test from 'ava';
import parse from '../library/parse';
import bodyEmpty from './body-empty';

const messages = {
	empty: 'chore: subject',
	filled: 'chore: subject\nbody'
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled)
};

test('with empty body should succeed for empty keyword', async t => {
	const [actual] = bodyEmpty(await parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('with empty body should fail for "never"', async t => {
	const [actual] = bodyEmpty(await parsed.empty, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('with empty body should succeed for "always"', async t => {
	const [actual] = bodyEmpty(await parsed.empty, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with body should fail for empty keyword', async t => {
	const [actual] = bodyEmpty(await parsed.filled);
	const expected = false;
	t.is(actual, expected);
});

test('with body should succeed for "never"', async t => {
	const [actual] = bodyEmpty(await parsed.filled, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with body should fail for "always"', async t => {
	const [actual] = bodyEmpty(await parsed.filled, 'always');
	const expected = false;
	t.is(actual, expected);
});
