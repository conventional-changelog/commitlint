import test from 'ava';
import ensure from './ensure-min-length';

test('false for no params', t => {
	const actual = ensure();
	t.is(actual, false);
});

test('true for a against 1', t => {
	const actual = ensure('a', 1);
	t.is(actual, true);
});

test('false for ab against 0', t => {
	const actual = ensure('a', 0);
	t.is(actual, true);
});

test('true for a against 2', t => {
	const actual = ensure('a', 2);
	t.is(actual, false);
});

test('true for ab against 2', t => {
	const actual = ensure('ab', 2);
	t.is(actual, true);
});
