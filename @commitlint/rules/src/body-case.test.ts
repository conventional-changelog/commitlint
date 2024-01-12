import parse from '@commitlint/parse';
import {bodyCase} from './body-case.js';

const messages = {
	empty: 'test: subject',
	lowercase: 'test: subject\nbody',
	mixedcase: 'test: subject\nBody',
	uppercase: 'test: subject\nBODY',
};

const parsed = {
	empty: parse(messages.empty),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase),
};

test('with empty body should succeed for "never lowercase"', async () => {
	const [actual] = bodyCase(await parsed.empty, 'never', 'lowercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty body should succeed for "always lowercase"', async () => {
	const [actual] = bodyCase(await parsed.empty, 'always', 'lowercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty body should succeed for "never uppercase"', async () => {
	const [actual] = bodyCase(await parsed.empty, 'never', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty body should succeed for "always uppercase"', async () => {
	const [actual] = bodyCase(await parsed.empty, 'always', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with lowercase body should fail for "never lowercase"', async () => {
	const [actual] = bodyCase(await parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with lowercase body should succeed for "always lowercase"', async () => {
	const [actual] = bodyCase(await parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase body should succeed for "never lowercase"', async () => {
	const [actual] = bodyCase(await parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase body should fail for "always lowercase"', async () => {
	const [actual] = bodyCase(await parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase body should succeed for "never uppercase"', async () => {
	const [actual] = bodyCase(await parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase body should fail for "always uppercase"', async () => {
	const [actual] = bodyCase(await parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with uppercase body should fail for "never uppercase"', async () => {
	const [actual] = bodyCase(await parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with lowercase body should succeed for "always uppercase"', async () => {
	const [actual] = bodyCase(await parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});
