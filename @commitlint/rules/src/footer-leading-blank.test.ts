import parse from '@commitlint/parse';
import {footerLeadingBlank} from './footer-leading-blank';

const messages = {
	simple: 'test: subject',
	body: 'test: subject\nbody',
	trailing: 'test: subject\nbody\n\n',
	without: 'test: subject\nbody\nBREAKING CHANGE: something important',
	withoutBody:
		'feat(new-parser): introduces a new parsing library\n\nBREAKING CHANGE: new library does not support foo-construct',
	withBodyWithComment:
		'feat(new-parser): introduces a new parsing library\n\nBody Line 1\n# comment\nBody Line 2\n\nBREAKING CHANGE: new library does not support foo-construct',
	with: 'test: subject\nbody\n\nBREAKING CHANGE: something important',
	withMulitLine:
		'test: subject\nmulti\nline\nbody\n\nBREAKING CHANGE: something important',
	withDoubleNewLine: 'fix: some issue\n\ndetailed explanation\n\ncloses #123',
};

const parsed = {
	simple: parse(messages.simple),
	body: parse(messages.body),
	trailing: parse(messages.trailing),
	without: parse(messages.without),
	withoutBody: parse(messages.withoutBody),
	withBodyWithComment: parse(messages.withBodyWithComment, undefined, {
		commentChar: '#',
	}),
	with: parse(messages.with),
	withMulitLine: parse(messages.withMulitLine),
	withDoubleNewLine: parse(messages.withDoubleNewLine),
};

test('with simple message should succeed for empty keyword', async () => {
	const [actual] = footerLeadingBlank(await parsed.simple);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with simple message should succeed for "never"', async () => {
	const [actual] = footerLeadingBlank(await parsed.simple, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with simple message should succeed for "always"', async () => {
	const [actual] = footerLeadingBlank(await parsed.simple, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with body message should succeed for empty keyword', async () => {
	const [actual] = footerLeadingBlank(await parsed.body);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with body message should succeed for "never"', async () => {
	const [actual] = footerLeadingBlank(await parsed.body, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with body message should succeed for "always"', async () => {
	const [actual] = footerLeadingBlank(await parsed.body, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with trailing message should succeed for empty keyword', async () => {
	const [actual] = footerLeadingBlank(await parsed.trailing);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with trailing message should succeed for "never"', async () => {
	const [actual] = footerLeadingBlank(await parsed.trailing, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with trailing message should succeed for "always"', async () => {
	const [actual] = footerLeadingBlank(await parsed.trailing, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without body should fail for "never"', async () => {
	const [actual] = footerLeadingBlank(await parsed.withoutBody, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without body should succeed for "always"', async () => {
	const [actual] = footerLeadingBlank(await parsed.withoutBody, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without blank line before footer should fail for empty keyword', async () => {
	const [actual] = footerLeadingBlank(await parsed.without);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without blank line before footer should succeed for "never"', async () => {
	const [actual] = footerLeadingBlank(await parsed.without, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without blank line before footer should fail for "always"', async () => {
	const [actual] = footerLeadingBlank(await parsed.without, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with blank line before footer should succeed for empty keyword', async () => {
	const [actual] = footerLeadingBlank(await parsed.with);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with blank line before footer should fail for "never"', async () => {
	const [actual] = footerLeadingBlank(await parsed.with, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with blank line before footer should succeed for "always"', async () => {
	const [actual] = footerLeadingBlank(await parsed.with, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with blank line before footer and multiline body should succeed for empty keyword', async () => {
	const [actual] = footerLeadingBlank(await parsed.withMulitLine);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with blank line before footer and multiline body should fail for "never"', async () => {
	const [actual] = footerLeadingBlank(await parsed.withMulitLine, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with blank line before footer and multiline body should succeed for "always"', async () => {
	const [actual] = footerLeadingBlank(await parsed.withMulitLine, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with double blank line before footer and double line in body should fail for "never"', async () => {
	const [actual] = footerLeadingBlank(await parsed.withDoubleNewLine, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with double blank line before footer and double line in body should succeed for "always"', async () => {
	const [actual] = footerLeadingBlank(await parsed.withDoubleNewLine, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with body containing comments should succeed for "always"', async () => {
	const [actual] = footerLeadingBlank(
		await parsed.withBodyWithComment,
		'always'
	);
	const expected = true;
	expect(actual).toEqual(expected);
});
