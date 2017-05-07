import test from 'ava';
import parse from '../library/parse';
import check from './type-enum';

const messages = {
	empty: '(): \n',
	a: 'a(): \n',
	b: 'b(): \n'
};

const parsed = {
	empty: parse(messages.empty),
	a: parse(messages.a),
	b: parse(messages.b)
};

test.failing('empty succeeds', t => {
	const [actual] = check(parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test.failing('empty on "a" succeeds', t => {
	const [actual] = check(parsed.empty, '', ['a']);
	const expected = true;
	t.is(actual, expected);
});

test.failing('empty on "always a" succeeds', t => {
	const [actual] = check(parsed.empty, 'always', ['a']);
	const expected = true;
	t.is(actual, expected);
});

test('empty on "never a" succeeds', t => {
	const [actual] = check(parsed.empty, 'never', ['a']);
	const expected = true;
	t.is(actual, expected);
});

test.failing('empty on "always a, b" succeeds', t => {
	const [actual] = check(parsed.empty, 'always', ['a', 'b']);
	const expected = true;
	t.is(actual, expected);
});

test.failing('empty on "never a, b" succeeds', t => {
	const [actual] = check(parsed.empty, 'neber', ['a', 'b']);
	const expected = true;
	t.is(actual, expected);
});

test('a on "a" succeeds', t => {
	const [actual] = check(parsed.a, '', ['a']);
	const expected = true;
	t.is(actual, expected);
});

test('a on "always a" succeeds', t => {
	const [actual] = check(parsed.a, 'always', ['a']);
	const expected = true;
	t.is(actual, expected);
});

test('a on "never a" fails', t => {
	const [actual] = check(parsed.a, 'never', ['a']);
	const expected = false;
	t.is(actual, expected);
});

test('b on "b" succeeds', t => {
	const [actual] = check(parsed.b, '', ['b']);
	const expected = true;
	t.is(actual, expected);
});

test('b on "always b" succeeds', t => {
	const [actual] = check(parsed.b, 'always', ['b']);
	const expected = true;
	t.is(actual, expected);
});

test('b on "never b" fails', t => {
	const [actual] = check(parsed.b, 'never', ['b']);
	const expected = false;
	t.is(actual, expected);
});

test('a on "a, b" succeeds', t => {
	const [actual] = check(parsed.a, '', ['a', 'b']);
	const expected = true;
	t.is(actual, expected);
});

test('a on "always a, b" succeeds', t => {
	const [actual] = check(parsed.a, 'always', ['a', 'b']);
	const expected = true;
	t.is(actual, expected);
});

test('a on "never a, b" fails', t => {
	const [actual] = check(parsed.a, 'never', ['a', 'b']);
	const expected = false;
	t.is(actual, expected);
});

test('b on "a, b" succeeds', t => {
	const [actual] = check(parsed.b, '', ['a', 'b']);
	const expected = true;
	t.is(actual, expected);
});

test('b on "always a, b" succeeds', t => {
	const [actual] = check(parsed.b, 'always', ['a', 'b']);
	const expected = true;
	t.is(actual, expected);
});

test('b on "never a, b" fails', t => {
	const [actual] = check(parsed.b, 'never', ['a', 'b']);
	const expected = false;
	t.is(actual, expected);
});
