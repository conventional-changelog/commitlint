import test from 'ava';
import parse from '../library/parse';
import check from './footer-min-length';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const value = long.length;

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

test('with simple should succeed', t => {
	const [actual] = check(parsed.simple, '', value);
	const expected = true;
	t.is(actual, expected);
});

test('with empty should succeed', t => {
	const [actual] = check(parsed.empty, '', value);
	const expected = true;
	t.is(actual, expected);
});

test('with short should fail', t => {
	const [actual] = check(parsed.short, '', value);
	const expected = false;
	t.is(actual, expected);
});

test('with long should succeed', t => {
	const [actual] = check(parsed.long, '', value);
	const expected = true;
	t.is(actual, expected);
});
