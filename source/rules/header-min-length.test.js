import test from 'ava';
import parse from '../library/parse';
import headerMinLength from './header-min-length';

const short = 'BREAKING CHANGE: a';
const long = 'BREAKING CHANGE: ab';

const needed = long.length;

const messages = {
	short,
	long
};

const parsed = {
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with short footer should fail', t => {
	const [actual] = headerMinLength(parsed.short, '', needed);
	const expected = false;
	t.is(actual, expected);
});

test('with long footer should succeed', t => {
	const [actual] = headerMinLength(parsed.long, '', needed);
	const expected = true;
	t.is(actual, expected);
});
