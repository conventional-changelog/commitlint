import parse from '@commitlint/parse';
import {bodyMinLength} from './body-min-length.js';

const short = 'a';
const long = 'ab';

const value = long.length;

const messages = {
	simple: 'test: subject',
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`,
};

const parsed = {
	simple: parse(messages.simple),
	short: parse(messages.short),
	long: parse(messages.long),
};

test('with simple should succeed', async () => {
	const [actual] = bodyMinLength(await parsed.simple, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with short should fail', async () => {
	const [actual] = bodyMinLength(await parsed.short, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with long should succeed', async () => {
	const [actual] = bodyMinLength(await parsed.long, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});
