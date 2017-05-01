import test from 'ava';
import parse from '../library/parse';
import footerMaxLength from './footer-max-length';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const allowed = short.length;

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
	const [actual] = footerMaxLength(parsed.simple, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('with empty footer should succeed', t => {
	const [actual] = footerMaxLength(parsed.empty, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('with short footer should succeed', t => {
	const [actual] = footerMaxLength(parsed.short, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('with long footer should fail', t => {
	const [actual] = footerMaxLength(parsed.long, '', allowed);
	const expected = false;
	t.is(actual, expected);
});

