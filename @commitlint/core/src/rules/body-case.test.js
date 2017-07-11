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

test('with empty body should succeed for "never lowercase"', async t => {
	const [actual] = bodyCase(await parsed.empty, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty body should succeed for "always lowercase"', async t => {
	const [actual] = bodyCase(await parsed.empty, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty body should succeed for "never uppercase"', async t => {
	const [actual] = bodyCase(await parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty body should succeed for "always uppercase"', async t => {
	const [actual] = bodyCase(await parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with lowercase body should fail for "never lowercase"', async t => {
	const [actual] = bodyCase(await parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase body should succeed for "always lowercase"', async t => {
	const [actual] = bodyCase(await parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase body should succeed for "never lowercase"', async t => {
	const [actual] = bodyCase(await parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase body should fail for "always lowercase"', async t => {
	const [actual] = bodyCase(await parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with mixedcase body should succeed for "never uppercase"', async t => {
	const [actual] = bodyCase(await parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase body should fail for "always uppercase"', async t => {
	const [actual] = bodyCase(await parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with uppercase body should fail for "never uppercase"', async t => {
	const [actual] = bodyCase(await parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase body should succeed for "always uppercase"', async t => {
	const [actual] = bodyCase(await parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
