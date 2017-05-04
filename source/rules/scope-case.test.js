import test from 'ava';
import parse from '../library/parse';
import scopeCase from './scope-case';

const messages = {
	empty: 'chore: subject',
	lowercase: 'chore(scope): subject',
	mixedcase: 'chore(sCoPe): subject',
	uppercase: 'chore(SCOPE): subject'
};

const parsed = {
	empty: parse(messages.empty),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase)
};

test.failing('with empty scope should succeed for "never lowercase"', t => {
	const [actual] = scopeCase(parsed.empty, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "always lowercase"', t => {
	const [actual] = scopeCase(parsed.empty, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "never uppercase"', t => {
	const [actual] = scopeCase(parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test.failing('with empty scope should succeed for "always uppercase"', t => {
	const [actual] = scopeCase(parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with lowercase scope should fail for "never lowercase"', t => {
	const [actual] = scopeCase(parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase scope should succeed for "always lowercase"', t => {
	const [actual] = scopeCase(parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase scope should succeed for "never lowercase"', t => {
	const [actual] = scopeCase(parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase scope should fail for "always lowercase"', t => {
	const [actual] = scopeCase(parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with mixedcase scope should succeed for "never uppercase"', t => {
	const [actual] = scopeCase(parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase scope should fail for "always uppercase"', t => {
	const [actual] = scopeCase(parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with uppercase scope should fail for "never uppercase"', t => {
	const [actual] = scopeCase(parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase scope should succeed for "always uppercase"', t => {
	const [actual] = scopeCase(parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
