import test from 'ava';
import parse from '@commitlint/parse';
import check from './body-max-line-length';

const short = 'a';
const long = 'ab';

const value = short.length;

const messages = {
	empty: 'test: subject',
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`,
	shortMultipleLines: `test:subject\n${short}\n${short}\n${short}`,
	longMultipleLines: `test:subject\n${short}\n${long}\n${short}`
};

const parsed = {
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long)
};

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

test('with short with multiple lines should succeed', async t => {
	const [actual] = check(await parsed.short, '', value);
	const expected = true;
	t.is(actual, expected);
});

test('with long with multiple lines should fail', async t => {
	const [actual] = check(await parsed.long, '', value);
	const expected = false;
	t.is(actual, expected);
});
