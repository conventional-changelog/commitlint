import parse from '@commitlint/parse';
import check from './header-max-length';

const short = 'test: a';
const long = 'test: ab';

const value = short.length;

const messages = {
	short,
	long
};

const parsed = {
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with short should succeed', async () => {
	const [actual] = check(await parsed.short, '', value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with long should fail', async () => {
	const [actual] = check(await parsed.long, '', value);
	const expected = false;
	expect(actual).toEqual(expected);
});
