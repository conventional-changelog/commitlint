import parse from '@commitlint/parse';
import check from './body-min-length';

const short = 'a';
const long = 'ab';

const value = long.length;

const messages = {
	simple: 'test: subject',
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`
};

const parsed = {
	simple: parse(messages.simple),
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with simple should succeed', async () => {
	const [actual] = check(await parsed.simple, '', value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with short should fail', async () => {
	const [actual] = check(await parsed.short, '', value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with long should succeed', async () => {
	const [actual] = check(await parsed.long, '', value);
	const expected = true;
	expect(actual).toEqual(expected);
});
