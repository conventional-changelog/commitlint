import test from 'ava';
import parse from '../library/parse';
import footerLeadingBlank from './footer-leading-blank';

const messages = {
	simple: 'chore: subject',
	body: 'chore: subject\nbody',
	trailing: 'chore: subject\nbody\n\n',
	without: 'chore: subject\nbody\nBREAKING CHANGE: something important',
	withoutBody:
		'feat(new-parser): introduces a new parsing library\n\nBREAKING CHANGE: new library does not support foo-construct',
	with: 'chore: subject\nbody\n\nBREAKING CHANGE: something important',
	withMulitLine:
		'chore: subject\nmulti\nline\nbody\n\nBREAKING CHANGE: something important'
};

const parsed = {
	simple: parse(messages.simple),
	body: parse(messages.body),
	trailing: parse(messages.trailing),
	without: parse(messages.without),
	withoutBody: parse(messages.withoutBody),
	with: parse(messages.with),
	withMulitLine: parse(messages.withMulitLine)
};

test('with simple message should succeed for empty keyword', async t => {
	const [actual] = footerLeadingBlank(await parsed.simple);
	const expected = true;
	t.is(actual, expected);
});

test('with simple message should succeed for "never"', async t => {
	const [actual] = footerLeadingBlank(await parsed.simple, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with simple message should succeed for "always"', async t => {
	const [actual] = footerLeadingBlank(await parsed.simple, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with body message should succeed for empty keyword', async t => {
	const [actual] = footerLeadingBlank(await parsed.body);
	const expected = true;
	t.is(actual, expected);
});

test('with body message should succeed for "never"', async t => {
	const [actual] = footerLeadingBlank(await parsed.body, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with body message should succeed for "always"', async t => {
	const [actual] = footerLeadingBlank(await parsed.body, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with trailing message should succeed for empty keyword', async t => {
	const [actual] = footerLeadingBlank(await parsed.trailing);
	const expected = true;
	t.is(actual, expected);
});

test('with trailing message should succeed for "never"', async t => {
	const [actual] = footerLeadingBlank(await parsed.trailing, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with trailing message should succeed for "always"', async t => {
	const [actual] = footerLeadingBlank(await parsed.trailing, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('without body should fail for "never"', async t => {
	const [actual] = footerLeadingBlank(await parsed.withoutBody, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('without body should succeed for "always"', async t => {
	const [actual] = footerLeadingBlank(await parsed.withoutBody, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('without blank line before footer should fail for empty keyword', async t => {
	const [actual] = footerLeadingBlank(await parsed.without);
	const expected = false;
	t.is(actual, expected);
});

test('without blank line before footer should succeed for "never"', async t => {
	const [actual] = footerLeadingBlank(await parsed.without, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('without blank line before footer should fail for "always"', async t => {
	const [actual] = footerLeadingBlank(await parsed.without, 'always');
	const expected = false;
	t.is(actual, expected);
});

test('with blank line before footer should succeed for empty keyword', async t => {
	const [actual] = footerLeadingBlank(await parsed.with);
	const expected = true;
	t.is(actual, expected);
});

test('with blank line before footer should fail for "never"', async t => {
	const [actual] = footerLeadingBlank(await parsed.with, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('with blank line before footer should succeed for "always"', async t => {
	const [actual] = footerLeadingBlank(await parsed.with, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with blank line before footer and multiline body should succeed for empty keyword', async t => {
	const [actual] = footerLeadingBlank(await parsed.withMulitLine);
	const expected = true;
	t.is(actual, expected);
});

test('with blank line before footer and multiline body should fail for "never"', async t => {
	const [actual] = footerLeadingBlank(await parsed.withMulitLine, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('with blank line before footer and multiline body should succeed for "always"', async t => {
	const [actual] = footerLeadingBlank(await parsed.withMulitLine, 'always');
	const expected = true;
	t.is(actual, expected);
});
