import test from 'ava';
import parse from '../library/parse';
import footerEmpty from './footer-empty';

const messages = {
	simple: 'chore: subject',
	empty: 'chore: subject\nbody',
	filled: 'chore: subject\nBREAKING CHANGE: something important'
};

const parsed = {
	simple: parse(messages.simple),
	empty: parse(messages.empty),
	filled: parse(messages.filled)
};

test('with simple message should succeed for empty keyword', async t => {
	const [actual] = footerEmpty(await parsed.simple);
	const expected = true;
	t.is(actual, expected);
});

test('with simple message should fail for "never"', async t => {
	const [actual] = footerEmpty(await parsed.simple, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('with simple message should succeed for "always"', async t => {
	const [actual] = footerEmpty(await parsed.simple, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with empty footer should succeed for empty keyword', async t => {
	const [actual] = footerEmpty(await parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('with empty footer should fail for "never"', async t => {
	const [actual] = footerEmpty(await parsed.empty, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('with empty footer should succeed for "always"', async t => {
	const [actual] = footerEmpty(await parsed.empty, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with footer should fail for empty keyword', async t => {
	const [actual] = footerEmpty(await parsed.filled);
	const expected = false;
	t.is(actual, expected);
});

test('with footer should succeed for "never"', async t => {
	const [actual] = footerEmpty(await parsed.filled, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with footer should fail for "always"', async t => {
	const [actual] = footerEmpty(await parsed.filled, 'always');
	const expected = false;
	t.is(actual, expected);
});
