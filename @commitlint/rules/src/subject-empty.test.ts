import {test, expect} from 'vitest';
import parse from '@commitlint/parse';
import {subjectEmpty} from './subject-empty.js';

const messages = {
	empty: 'test: \nbody',
	filled: 'test: subject\nbody',
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled),
};

test('without subject should succeed for empty keyword', async () => {
	const [actual] = subjectEmpty(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without subject should fail for "never"', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without subject should succeed for "always"', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with subject fail for empty keyword', async () => {
	const [actual] = subjectEmpty(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with subject succeed for "never"', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with subject fail for "always"', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});
