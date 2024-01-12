import parse from '@commitlint/parse';
import {headerMaxLength} from './header-max-length.js';

const short = 'test: a';
const long = 'test: ab';

const value = short.length;

const messages = {
	short,
	long,
};

const parsed = {
	short: parse(messages.short),
	long: parse(messages.long),
};

test('with short should succeed', async () => {
	const [actual] = headerMaxLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with long should fail', async () => {
	const [actual] = headerMaxLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});
