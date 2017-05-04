import test from 'ava';
import parse from '../library/parse';
import check from './subject-max-length';

const short = 'a';
const long = 'ab';

const value = short.length;

const messages = {
	empty: 'chore:\n',
	short: `chore: ${short}\n`,
	long: `chore: ${long}\n`
};

const parsed = {
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with empty should succeed', t => {
	const [actual] = check(parsed.empty, '', value);
	const expected = true;
	t.is(actual, expected);
});

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
