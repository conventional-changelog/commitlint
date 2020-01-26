import parse from '@commitlint/parse';
import check from './scope-max-length';

const short = 'a';
const long = 'ab';

const value = short.length;

const messages = {
	empty: 'test: \n',
	short: `test(${short}): \n`,
	long: `test(${long}): \n`
};

const parsed = {
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with empty should succeed', async () => {
	const [actual] = check(await parsed.empty, '', value);
	const expected = true;
	expect(actual).toEqual(expected);
});

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
