import test from 'ava';
import * as u from '.';

test('exports a git namespace', t => {
	t.is(typeof u.git, 'object');
});

test('git namespace has bootstrap', t => {
	t.is(typeof u.git.bootstrap, 'function');
});

test('git namespace has clone', t => {
	t.is(typeof u.git.clone, 'function');
});
