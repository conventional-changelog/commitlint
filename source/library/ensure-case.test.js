import test from 'ava';
import ensure from './ensure-case';

test('true for no params', t => {
	const actual = ensure();
	t.is(actual, true);
});

test('true for empty', t => {
	const actual = ensure('');
	t.is(actual, true);
});

test('true for lowercase', t => {
	const actual = ensure('a');
	t.is(actual, true);
});

test('false for uppercase', t => {
	const actual = ensure('A');
	t.is(actual, false);
});

test('true for lowercase on lowercase', t => {
	const actual = ensure('a', 'lowercase');
	t.is(actual, true);
});

test('false for uppercase on lowercase', t => {
	const actual = ensure('A', 'lowercase');
	t.is(actual, false);
});

test('true for uppercase on uppercase', t => {
	const actual = ensure('A', 'uppercase');
	t.is(actual, true);
});

test('false for lowercase on lowercase', t => {
	const actual = ensure('a', 'uppercase');
	t.is(actual, false);
});
