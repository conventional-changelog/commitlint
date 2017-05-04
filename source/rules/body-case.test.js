import test from 'ava';
import parse from '../library/parse';
import bodyCase from './body-case';

const messages = {
	empty: 'chore: subject',
	lowercase: 'chore: subject\nbody',
	mixedcase: 'chore: subject\nBody',
	uppercase: 'chore: subject\nBODY'
};

const parsed = {
	empty: parse(messages.empty),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase)
};

test('with empty body should succeed for "never lowercase"', t => {
	const [actual] = bodyCase(parsed.empty, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty body should succeed for "always lowercase"', t => {
	const [actual] = bodyCase(parsed.empty, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty body should succeed for "never uppercase"', t => {
	const [actual] = bodyCase(parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty body should succeed for "always uppercase"', t => {
	const [actual] = bodyCase(parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test.failing('with lowercase body should fail for "never lowercase"', t => {
	const [actual] = bodyCase(parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test.failing('with lowercase body should succeed for "always lowercase"', t => {
	const [actual] = bodyCase(parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test.failing('with mixedcase body should fail for "never lowercase"', t => {
	const [actual] = bodyCase(parsed.mixedcase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test.failing('with mixedcase body should fail for "always lowercase"', t => {
	const [actual] = bodyCase(parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test.failing('with uppercase body should fail for "never uppercase"', t => {
	const [actual] = bodyCase(parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test.failing('with lowercase body should succeed for "always uppercase"', t => {
	const [actual] = bodyCase(parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
