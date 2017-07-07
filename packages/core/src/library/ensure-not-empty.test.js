import test from 'ava';
import ensure from './ensure-not-empty';

test('false for no params', t => {
	const actual = ensure();
	t.is(actual, false);
});

test('false for ""', t => {
	const actual = ensure('');
	t.is(actual, false);
});

test('true for a', t => {
	const actual = ensure('a');
	t.is(actual, true);
});
