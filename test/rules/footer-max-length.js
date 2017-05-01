import test from 'ava';
import parse from '../../source/library/parse';
import footerMaxLength from '../../source/rules/footer-max-length';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

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
	long: parse(messages.short)
};

test('footer-max-length with simple message should succeed', t => {
	const [actual] = footerMaxLength(parsed.simple, '', short.length);
	const expected = true;
	t.is(actual, expected);
});

test('footer-max-length with empty footer should succeed', t => {
	const [actual] = footerMaxLength(parsed.empty, '', short.length);
	const expected = true;
	t.is(actual, expected);
});

test('footer-max-length with short footer should succeed', t => {
	const [actual] = footerMaxLength(parsed.short, '', short.length);
	const expected = true;
	t.is(actual, expected);
});

test('footer-max-length with long footer should succeed', t => {
	const [actual] = footerMaxLength(parsed.long, '', short.length);
	const expected = true;
	t.is(actual, expected);
});

