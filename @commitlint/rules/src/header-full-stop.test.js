import test from 'ava';
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

test('with against "always ." should succeed', async t => {
	const [actual] = check(await parsed.with, 'always', '.');
	const expected = true;
	t.is(actual, expected);
});

test('with against "never ." should fail', async t => {
	const [actual] = check(await parsed.with, 'never', '.');
	const expected = false;
	t.is(actual, expected);
});

test('without against "always ." should fail', async t => {
	const [actual] = check(await parsed.without, 'always', '.');
	const expected = false;
	t.is(actual, expected);
});

test('without against "never ." should succeed', async t => {
	const [actual] = check(await parsed.without, 'never', '.');
	const expected = true;
	t.is(actual, expected);
});
