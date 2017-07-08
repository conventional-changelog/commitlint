import test from 'ava';
import parse from '../library/parse';
import typeCase from './type-case';

const messages = {
	empty: '(scope): subject',
	lowercase: 'type: subject',
	mixedcase: 'tYpE: subject',
	uppercase: 'TYPE: subject'
};

const parsed = {
	empty: parse(messages.empty),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase)
};

test('with empty type should succeed for "never lowercase"', t => {
	const [actual] = typeCase(parsed.empty, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty type should succeed for "always lowercase"', t => {
	const [actual] = typeCase(parsed.empty, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty type should succeed for "never uppercase"', t => {
	const [actual] = typeCase(parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty type should succeed for "always uppercase"', t => {
	const [actual] = typeCase(parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with lowercase type should fail for "never lowercase"', t => {
	const [actual] = typeCase(parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase type should succeed for "always lowercase"', t => {
	const [actual] = typeCase(parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase type should succeed for "never lowercase"', t => {
	const [actual] = typeCase(parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase type should fail for "always lowercase"', t => {
	const [actual] = typeCase(parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with mixedcase type should succeed for "never uppercase"', t => {
	const [actual] = typeCase(parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase type should fail for "always uppercase"', t => {
	const [actual] = typeCase(parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with uppercase type should fail for "never uppercase"', t => {
	const [actual] = typeCase(parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase type should succeed for "always uppercase"', t => {
	const [actual] = typeCase(parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
