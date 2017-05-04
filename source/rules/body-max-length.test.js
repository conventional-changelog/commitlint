import test from 'ava';
import parse from '../library/parse';
import bodyMaxLength from './body-max-length';

const short = 'a';
const long = 'ab';

const allowed = short.length;

const messages = {
	empty: 'chore: subject',
	short: `chore: subject\n${short}`,
	long: `chore: subject\n${long}`
};

const parsed = {
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long)
};

test('with empty should succeed', t => {
	const [actual] = bodyMaxLength(parsed.empty, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('with short should succeed', t => {
	const [actual] = bodyMaxLength(parsed.short, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('with long should fail', t => {
	const [actual] = bodyMaxLength(parsed.long, '', allowed);
	const expected = false;
	t.is(actual, expected);
});
