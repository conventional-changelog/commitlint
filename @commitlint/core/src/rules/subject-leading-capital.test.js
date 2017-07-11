import test from 'ava';
import parse from '../library/parse';
import check from './subject-leading-capital';

const messages = {
	empty: 'chore:\n',
	with: `chore: Subject\n`,
	without: `chore: subject\n`
};

const parsed = {
	empty: parse(messages.empty),
	with: parse(messages.with),
	without: parse(messages.without)
};

test('empty should succeed', async t => {
	const [actual] = check(await parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('empty against "always" should succeed', async t => {
	const [actual] = check(await parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('empty against "never" should succeed', async t => {
	const [actual] = check(await parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with should succeed', async t => {
	const [actual] = check(await parsed.with);
	const expected = true;
	t.is(actual, expected);
});

test('with against "always" should succeed', async t => {
	const [actual] = check(await parsed.with, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with against "never" should fail', async t => {
	const [actual] = check(await parsed.with, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('without should fail', async t => {
	const [actual] = check(await parsed.without, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('without against "always" should fail', async t => {
	const [actual] = check(await parsed.without, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('without against "never" should succeed', async t => {
	const [actual] = check(await parsed.without, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
