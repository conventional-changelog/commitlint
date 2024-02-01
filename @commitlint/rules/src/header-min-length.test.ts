import {test, expect} from 'vitest';
import parse from '@commitlint/parse';
import {headerMinLength} from './header-min-length.js';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const value = long.length;

const messages = {
	short,
	long,
};

const parsed = {
	short: parse(messages.short),
	long: parse(messages.long),
};

test('with short should fail', async () => {
	const [actual] = headerMinLength(await parsed.short, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with long should succeed', async () => {
	const [actual] = headerMinLength(await parsed.long, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});
