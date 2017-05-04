import test from 'ava';
import parse from '../library/parse';
import check from './header-max-length';

const short = 'chore: a';
const long = 'chore: ab';

const value = short.length;

const messages = {
	short,
	long
};

const parsed = {
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with short should succeed', t => {
	const [actual] = check(parsed.short, '', value);
	const expected = true;
	t.is(actual, expected);
});

test('with long should fail', t => {
	const [actual] = check(parsed.long, '', value);
	const expected = false;
	t.is(actual, expected);
});
