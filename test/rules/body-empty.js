import test from 'ava';
import parse from '../../source/library/parse';
import bodyEmpty from '../../source/rules/body-empty';

const messages = {
	empty: 'chore: subject',
	filled: 'chore: subject\nbody'
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled)
};

test('with empty body should succeed for empty keyword', t => {
	const [actual] = bodyEmpty(parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('with empty body should fail for "never"', t => {
	const [actual] = bodyEmpty(parsed.empty, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('with empty body should succeed for "always"', t => {
	const [actual] = bodyEmpty(parsed.empty, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with body should fail for empty keyword', t => {
	const [actual] = bodyEmpty(parsed.filled);
	const expected = false;
	t.is(actual, expected);
});

test('with body should succeed for "never"', t => {
	const [actual] = bodyEmpty(parsed.filled, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with body should fail for "always"', t => {
	const [actual] = bodyEmpty(parsed.filled, 'always');
	const expected = false;
	t.is(actual, expected);
});
