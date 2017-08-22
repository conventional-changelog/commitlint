import test from 'ava';
import preset from '.';

test('does not throw', t => {
	t.notThrows(() => preset());
});

test('returns an object', t => {
	t.is(typeof preset(), 'object');
});
