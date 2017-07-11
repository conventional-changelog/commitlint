import test from 'ava';
import parse from '../library/parse';
import bodyLeadingBlank from './body-leading-blank';

const messages = {
	simple: 'chore: subject',
	without: 'chore: subject\nbody',
	with: 'chore: subject\n\nbody'
};

const parsed = {
	simple: parse(messages.simple),
	without: parse(messages.without),
	with: parse(messages.with)
};

test('with simple message should succeed for empty keyword', async t => {
	const [actual] = bodyLeadingBlank(await parsed.simple);
	const expected = true;
	t.is(actual, expected);
});

test('with simple message should succeed for "never"', async t => {
	const [actual] = bodyLeadingBlank(await parsed.simple, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with simple message should succeed for "always"', async t => {
	const [actual] = bodyLeadingBlank(await parsed.simple, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('without blank line before body should fail for empty keyword', async t => {
	const [actual] = bodyLeadingBlank(await parsed.without);
	const expected = false;
	t.is(actual, expected);
});

test('without blank line before body should succeed for "never"', async t => {
	const [actual] = bodyLeadingBlank(await parsed.without, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('without blank line before body should fail for "always"', async t => {
	const [actual] = bodyLeadingBlank(await parsed.without, 'always');
	const expected = false;
	t.is(actual, expected);
});

test('with blank line before body should succeed for empty keyword', async t => {
	const [actual] = bodyLeadingBlank(await parsed.with);
	const expected = true;
	t.is(actual, expected);
});

test('with blank line before body should fail for "never"', async t => {
	const [actual] = bodyLeadingBlank(await parsed.with, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('with blank line before body should succeed for "always"', async t => {
	const [actual] = bodyLeadingBlank(await parsed.with, 'always');
	const expected = true;
	t.is(actual, expected);
});
