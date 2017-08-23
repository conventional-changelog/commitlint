import test from 'ava';
import * as babel from 'babel-core';
import preset from '.';

test('does not throw', t => {
	t.notThrows(() => preset());
});

test('returns an object', t => {
	t.is(typeof preset(), 'object');
});

test('succeeds for a simple babel transformation', t => {
	t.notThrows(() => babel.transform('code();', preset));
});

test('produces valid values in plugins', t => {
	const config = preset();
	t.true(config.plugins.every(plugin => {
		if (Array.isArray(plugin)) {
			return typeof plugin[0] === 'function';
		}
		return typeof plugin === 'function';
	}));
});
