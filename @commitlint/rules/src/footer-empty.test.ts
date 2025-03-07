import {test, expect} from 'vitest';
import parse from '@commitlint/parse';
import {footerEmpty} from './footer-empty.js';

const messages = {
	simple: 'test: subject',
	empty: 'test: subject\nbody',
	filled: 'test: subject\nBREAKING CHANGE: something important',
};

const parsed = {
	simple: parse(messages.simple),
	empty: parse(messages.empty),
	filled: parse(messages.filled),
};

test('with simple message should succeed for empty keyword', async () => {
	const [actual] = footerEmpty(await parsed.simple);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with simple message should fail for "never"', async () => {
	const [actual] = footerEmpty(await parsed.simple, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with simple message should succeed for "always"', async () => {
	const [actual] = footerEmpty(await parsed.simple, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty footer should succeed for empty keyword', async () => {
	const [actual] = footerEmpty(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty footer should fail for "never"', async () => {
	const [actual] = footerEmpty(await parsed.empty, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with empty footer should succeed for "always"', async () => {
	const [actual] = footerEmpty(await parsed.empty, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with footer should fail for empty keyword', async () => {
	const [actual] = footerEmpty(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with footer should succeed for "never"', async () => {
	const [actual] = footerEmpty(await parsed.filled, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with footer should fail for "always"', async () => {
	const [actual] = footerEmpty(await parsed.filled, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});
