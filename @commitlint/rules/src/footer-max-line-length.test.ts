import {test, expect} from 'vitest';
import parse from '@commitlint/parse';
import {footerMaxLineLength} from './footer-max-line-length.js';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const value = short.length;

const messages = {
	simple: 'test: subject',
	empty: 'test: subject\nbody',
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`,
	shortMultipleLines: `test:subject\n${short}\n${short}\n${short}`,
	longMultipleLines: `test:subject\n${short}\n${long}\n${short}`,
};

const parsed = {
	simple: parse(messages.simple),
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long),
};

test('with simple should succeed', async () => {
	const [actual] = footerMaxLineLength(await parsed.simple, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty should succeed', async () => {
	const [actual] = footerMaxLineLength(await parsed.empty, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with short should succeed', async () => {
	const [actual] = footerMaxLineLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with long should fail', async () => {
	const [actual] = footerMaxLineLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with short with multiple lines should succeed', async () => {
	const [actual] = footerMaxLineLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with long with multiple lines should fail', async () => {
	const [actual] = footerMaxLineLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});
