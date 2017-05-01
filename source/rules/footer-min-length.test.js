import test from 'ava';
import parse from '../library/parse';
import footerMinLength from './footer-min-length';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const needed = long.length;

const messages = {
	simple: 'chore: subject',
	empty: 'chore: subject\nbody',
	short: `chore: subject\n${short}`,
	long: `chore: subject\n${long}`
};

const parsed = {
	simple: parse(messages.simple),
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with simple message should succeed', t => {
	const [actual] = footerMinLength(parsed.simple, '', needed);
	const expected = true;
	t.is(actual, expected);
});

test('with empty footer should succeed', t => {
	const [actual] = footerMinLength(parsed.empty, '', needed);
	const expected = true;
	t.is(actual, expected);
});

test('with short footer should fail', t => {
	const [actual] = footerMinLength(parsed.short, '', needed);
	const expected = false;
	t.is(actual, expected);
});

test('with long footer should succeed', t => {
	const [actual] = footerMinLength(parsed.long, '', needed);
	const expected = true;
	t.is(actual, expected);
});

