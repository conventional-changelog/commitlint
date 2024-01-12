import parse from '@commitlint/parse';
import {typeMaxLength} from './type-max-length.js';

const short = 'a';
const long = 'ab';

const value = short.length;

const messages = {
	empty: '():\n',
	short: `${short}: \n`,
	long: `${long}: \n`,
};

const parsed = {
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long),
};

test('with empty should succeed', async () => {
	const [actual] = typeMaxLength(await parsed.empty, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with short should succeed', async () => {
	const [actual] = typeMaxLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with long should fail', async () => {
	const [actual] = typeMaxLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});
