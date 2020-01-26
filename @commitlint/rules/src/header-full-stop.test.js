import parse from '@commitlint/parse';
import check from './header-full-stop';

const messages = {
	with: `header.\n`,
	without: `header\n`
};

const parsed = {
	with: parse(messages.with),
	without: parse(messages.without)
};

test('with against "always ." should succeed', async () => {
	const [actual] = check(await parsed.with, 'always', '.');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "never ." should fail', async () => {
	const [actual] = check(await parsed.with, 'never', '.');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "always ." should fail', async () => {
	const [actual] = check(await parsed.without, 'always', '.');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "never ." should succeed', async () => {
	const [actual] = check(await parsed.without, 'never', '.');
	const expected = true;
	expect(actual).toEqual(expected);
});
