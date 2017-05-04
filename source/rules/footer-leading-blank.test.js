import test from 'ava';
import parse from '../library/parse';
import footerLeadingBlank from './footer-leading-blank';

const messages = {
	simple: 'chore: subject',
	body: 'chore: subject\nbody',
	trailing: 'chore: subject\nbody\n\n',
	without: 'chore: subject\nbody\nBREAKING CHANGE: something important',
	with: 'chore: subject\nbody\n\nBREAKING CHANGE: something important',
	withMulitLine: 'chore: subject\nmulti\nline\nbody\n\nBREAKING CHANGE: something important'
};

const parsed = {
	simple: parse(messages.simple),
	body: parse(messages.body),
	trailing: parse(messages.trailing),
	without: parse(messages.without),
	with: parse(messages.with),
	withMulitLine: parse(messages.withMulitLine)
};

test('with simple message should succeed for empty keyword', t => {
	const [actual] = footerLeadingBlank(parsed.simple);
	const expected = true;
	t.is(actual, expected);
});

test('with simple message should succeed for "never"', t => {
	const [actual] = footerLeadingBlank(parsed.simple, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with simple message should succeed for "always"', t => {
	const [actual] = footerLeadingBlank(parsed.simple, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with body message should succeed for empty keyword', t => {
	const [actual] = footerLeadingBlank(parsed.body);
	const expected = true;
	t.is(actual, expected);
});

test('with body message should succeed for "never"', t => {
	const [actual] = footerLeadingBlank(parsed.body, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with body message should succeed for "always"', t => {
	const [actual] = footerLeadingBlank(parsed.body, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with trailing message should succeed for empty keyword', t => {
	const [actual] = footerLeadingBlank(parsed.trailing);
	const expected = true;
	t.is(actual, expected);
});

test('with trailing message should succeed for "never"', t => {
	const [actual] = footerLeadingBlank(parsed.trailing, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with trailing message should succeed for "always"', t => {
	const [actual] = footerLeadingBlank(parsed.trailing, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('without blank line before footer should fail for empty keyword', t => {
	const [actual] = footerLeadingBlank(parsed.without);
	const expected = false;
	t.is(actual, expected);
});

test('without blank line before footer should succeed for "never"', t => {
	const [actual] = footerLeadingBlank(parsed.without, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('without blank line before footer should fail for "always"', t => {
	const [actual] = footerLeadingBlank(parsed.without, 'always');
	const expected = false;
	t.is(actual, expected);
});

test('with blank line before footer should succeed for empty keyword', t => {
	const [actual] = footerLeadingBlank(parsed.with);
	const expected = true;
	t.is(actual, expected);
});

test('with blank line before footer should fail for "never"', t => {
	const [actual] = footerLeadingBlank(parsed.with, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('with blank line before footer should succeed for "always"', t => {
	const [actual] = footerLeadingBlank(parsed.with, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with blank line before footer and multiline body should succeed for empty keyword', t => {
	const [actual] = footerLeadingBlank(parsed.withMulitLine);
	const expected = true;
	t.is(actual, expected);
});

test('with blank line before footer and multiline body should fail for "never"', t => {
	const [actual] = footerLeadingBlank(parsed.withMulitLine, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('with blank line before footer and multiline body should succeed for "always"', t => {
	const [actual] = footerLeadingBlank(parsed.withMulitLine, 'always');
	const expected = true;
	t.is(actual, expected);
});
