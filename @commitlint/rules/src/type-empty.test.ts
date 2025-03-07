import {test, expect} from 'vitest';
import parse from '@commitlint/parse';
import {typeEmpty} from './type-empty.js';

const messages = {
	empty: '(scope):',
	filled: 'type: subject',
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled),
};

test('without type should succeed for empty keyword', async () => {
	const [actual] = typeEmpty(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without type should fail for "never"', async () => {
	const [actual] = typeEmpty(await parsed.empty, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without type should succeed for "always"', async () => {
	const [actual] = typeEmpty(await parsed.empty, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with type fail for empty keyword', async () => {
	const [actual] = typeEmpty(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with type succeed for "never"', async () => {
	const [actual] = typeEmpty(await parsed.filled, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with type fail for "always"', async () => {
	const [actual] = typeEmpty(await parsed.filled, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});
