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

test('empty should succeed', t => {
	const [actual] = check(parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('empty against "always" should succeed', t => {
	const [actual] = check(parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('empty against "never" should succeed', t => {
	const [actual] = check(parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test.failing('with should succeed', t => {
	const [actual] = check(parsed.with);
	const expected = true;
	t.is(actual, expected);
});

test.failing('with against "always" should succeed', t => {
	const [actual] = check(parsed.with, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test.failing('with against "never" should fail', t => {
	const [actual] = check(parsed.with, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test.failing('without should fail', t => {
	const [actual] = check(parsed.without, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test.failing('without against "always" should fail', t => {
	const [actual] = check(parsed.without, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test.failing('without against "never" should succeed', t => {
	const [actual] = check(parsed.without, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
