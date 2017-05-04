import test from 'ava';
import parse from '../library/parse';
import check from './header-min-length';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const value = long.length;

const messages = {
	short,
	long
};

const parsed = {
	short: parse(messages.short),
	long: parse(messages.long)
};

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
