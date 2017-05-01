import test from 'ava';
import parse from '../../source/library/parse';
import footerMaxLength from '../../source/rules/footer-max-length';

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

test('footer-max-length with simple message should succeed', t => {
	const [actual] = footerMaxLength(parsed.simple, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('footer-max-length with empty footer should succeed', t => {
	const [actual] = footerMaxLength(parsed.empty, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('footer-max-length with short footer should succeed', t => {
	const [actual] = footerMaxLength(parsed.short, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('footer-max-length with long footer should fail', t => {
	const [actual] = footerMaxLength(parsed.long, '', allowed);
	const expected = false;
	t.is(actual, expected);
});

