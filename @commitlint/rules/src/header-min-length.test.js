import parse from '@commitlint/parse';
import check from './header-min-length';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const value = long.length;

const messages = {
	short,
	long
};

const parsed = {
	short: parse(messages.short),
	long: parse(messages.long)
};

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
