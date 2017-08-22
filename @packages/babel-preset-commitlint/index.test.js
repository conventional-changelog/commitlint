import test from 'ava';
import * as babel from 'babel-core';
import preset from '.';

test('does not throw', t => {
	t.notThrows(() => preset());
});

test('returns an object', t => {
	t.is(typeof preset(), 'object');
});

test('does not throw for a simple babel transformation', t => {
	t.notThrows(() => babel.transform('code();', preset));
});
