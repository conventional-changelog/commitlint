import parse from '@commitlint/parse';
import {bodyMaxLineLength} from './body-max-line-length.js';

const short = 'a';
const long = 'ab';

const value = short.length;

const messages = {
	empty: 'test: subject',
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`,
	shortMultipleLines: `test:subject\n${short}\n${short}\n${short}`,
	longMultipleLines: `test:subject\n${short}\n${long}\n${short}`,
};

const parsed = {
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long),
};

test('with empty should succeed', async () => {
	const [actual] = bodyMaxLineLength(await parsed.empty, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with short should succeed', async () => {
	const [actual] = bodyMaxLineLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with long should fail', async () => {
	const [actual] = bodyMaxLineLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with short with multiple lines should succeed', async () => {
	const [actual] = bodyMaxLineLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with long with multiple lines should fail', async () => {
	const [actual] = bodyMaxLineLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});
