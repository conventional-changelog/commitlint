import test from 'ava';
import parse from '../library/parse';
import bodyMaxLength from './body-max-length';

const short = 'a';
const long = 'ab';

const allowed = short.length;

const messages = {
	simple: 'chore: subject',
	short: `chore: subject\n${short}`,
	long: `chore: subject\n${long}`
};

const parsed = {
	simple: parse(messages.simple),
	short: parse(messages.short),
	long: parse(messages.long)
};

test.failing('with simple message should succeed', t => {
	const [actual] = bodyMaxLength(parsed.simple, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('with short body should succeed', t => {
	const [actual] = bodyMaxLength(parsed.short, '', allowed);
	const expected = true;
	t.is(actual, expected);
});

test('with long body should fail', t => {
	const [actual] = bodyMaxLength(parsed.long, '', allowed);
	const expected = false;
	t.is(actual, expected);
});
