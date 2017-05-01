import test from 'ava';
import parse from '../../source/library/parse';
import typeEmpty from '../../source/rules/type-empty';

const messages = {
	empty: '(scope):',
	filled: 'type: subject'
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled)
};

test('without type should succeed for empty keyword', t => {
	const [actual] = typeEmpty(parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('without type should fail for "never"', t => {
	const [actual] = typeEmpty(parsed.empty, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('without type should succeed for "always"', t => {
	const [actual] = typeEmpty(parsed.empty, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with type fail for empty keyword', t => {
	const [actual] = typeEmpty(parsed.filled);
	const expected = false;
	t.is(actual, expected);
});

test('with type succeed for "never"', t => {
	const [actual] = typeEmpty(parsed.filled, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with type fail for "always"', t => {
	const [actual] = typeEmpty(parsed.filled, 'always');
	const expected = false;
	t.is(actual, expected);
});
