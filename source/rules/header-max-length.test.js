import test from 'ava';
import parse from '../library/parse';
import headerMaxLength from './header-max-length';

const short = 'chore: a';
const long = 'chore: ab';

const allowed = short.length;

const messages = {
	short,
	long
};

const parsed = {
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with short should succeed', t => {
	const [actual] = headerMaxLength(parsed.short, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('with long should fail', t => {
	const [actual] = headerMaxLength(parsed.long, '', allowed);
	const expected = false;
	t.is(actual, expected);
});
