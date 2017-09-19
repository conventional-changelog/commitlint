import test from 'ava';
import ensure from './ensure-contains';

test('false for no params', t => {
	const actual = ensure();
	t.is(actual, false);
});

test('true for /^foo/gi against foo', t => {
	const actual = ensure('foo', /^foo/gi);
	t.is(actual, true);
});

test('false for /^foo/gi against notfoo', t => {
	const actual = ensure('notfoo', /^foo/gi);
	t.is(actual, false);
});