import parse from '@commitlint/parse';
import {bodyLeadingBlank} from './body-leading-blank.js';

const messages = {
	simple: 'test: subject',
	without: 'test: subject\nbody',
	with: 'test: subject\n\nbody',
};

const parsed = {
	simple: parse(messages.simple),
	without: parse(messages.without),
	with: parse(messages.with),
};

test('with simple message should succeed for empty keyword', async () => {
	const [actual] = bodyLeadingBlank(await parsed.simple);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with simple message should succeed for "never"', async () => {
	const [actual] = bodyLeadingBlank(await parsed.simple, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with simple message should succeed for "always"', async () => {
	const [actual] = bodyLeadingBlank(await parsed.simple, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without blank line before body should fail for empty keyword', async () => {
	const [actual] = bodyLeadingBlank(await parsed.without);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without blank line before body should succeed for "never"', async () => {
	const [actual] = bodyLeadingBlank(await parsed.without, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without blank line before body should fail for "always"', async () => {
	const [actual] = bodyLeadingBlank(await parsed.without, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with blank line before body should succeed for empty keyword', async () => {
	const [actual] = bodyLeadingBlank(await parsed.with);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with blank line before body should fail for "never"', async () => {
	const [actual] = bodyLeadingBlank(await parsed.with, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with blank line before body should succeed for "always"', async () => {
	const [actual] = bodyLeadingBlank(await parsed.with, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});
