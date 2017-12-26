import test from 'ava';
import parse from '@commitlint/parse';
import check from './footer-max-length';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const value = short.length;

const messages = {
	simple: 'test: subject',
	empty: 'test: subject\nbody',
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`
};

const parsed = {
	simple: parse(messages.simple),
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with simple should succeed', async t => {
	const [actual] = check(await parsed.simple, '', value);
	const expected = true;
	t.is(actual, expected);
});

test('with empty should succeed', async t => {
	const [actual] = check(await parsed.empty, '', value);
	const expected = true;
	t.is(actual, expected);
});

test('with short should succeed', async t => {
	const [actual] = check(await parsed.short, '', value);
	const expected = true;
	t.is(actual, expected);
});

test('with long should fail', async t => {
	const [actual] = check(await parsed.long, '', value);
	const expected = false;
	t.is(actual, expected);
});
