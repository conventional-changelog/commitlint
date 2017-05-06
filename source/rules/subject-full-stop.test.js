import test from 'ava';
import parse from '../library/parse';
import check from './subject-full-stop';

const messages = {
	empty: 'chore:\n',
	with: `chore: subject.\n`,
	without: `chore: subject\n`
};

const parsed = {
	empty: parse(messages.empty),
	with: parse(messages.with),
	without: parse(messages.without)
};

test('empty against "always" should succeed', t => {
	const [actual] = check(parsed.empty, 'always', '.');
	const expected = true;
	t.is(actual, expected);
});

test('empty against "never ." should succeed', t => {
	const [actual] = check(parsed.empty, 'never', '.');
	const expected = true;
	t.is(actual, expected);
});

test('with against "always ." should succeed', t => {
	const [actual] = check(parsed.with, 'always', '.');
	const expected = true;
	t.is(actual, expected);
});

test('with against "never ." should fail', t => {
	const [actual] = check(parsed.with, 'never', '.');
	const expected = false;
	t.is(actual, expected);
});

test('without against "always ." should fail', t => {
	const [actual] = check(parsed.without, 'always', '.');
	const expected = false;
	t.is(actual, expected);
});

test('without against "never ." should succeed', t => {
	const [actual] = check(parsed.without, 'never', '.');
	const expected = true;
	t.is(actual, expected);
});
