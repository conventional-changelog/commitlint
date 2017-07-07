import test from 'ava';
import ensure from './ensure-enum';

test('false for no params', t => {
	const actual = ensure();
	t.is(actual, false);
});

test('true for a against a', t => {
	const actual = ensure('a', ['a']);
	t.is(actual, true);
});

test('false for a against b', t => {
	const actual = ensure('a', ['b']);
	t.is(actual, false);
});

test('true for a against a, b', t => {
	const actual = ensure('a', ['a', 'b']);
	t.is(actual, true);
});

test('false for b against a', t => {
	const actual = ensure('b', ['a']);
	t.is(actual, false);
});

test('true for b against b', t => {
	const actual = ensure('b', ['b']);
	t.is(actual, true);
});

test('true for b against a, b', t => {
	const actual = ensure('b', ['a', 'b']);
	t.is(actual, true);
});

test('false for c against a, b', t => {
	const actual = ensure('c', ['a', 'b']);
	t.is(actual, false);
});
