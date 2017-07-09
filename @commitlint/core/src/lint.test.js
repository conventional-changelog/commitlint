import test from 'ava';
import lint from './lint';

test('throws without params', t => {
	t.throws(() => lint());
});

test('throws with empty message', t => {
	t.throws(() => lint(''));
});

test('positive on stub message and no rule', t => {
	const actual = lint('foo: bar');
	t.true(actual.valid);
});

test('positive on stub message and adhered rule', t => {
	const actual = lint('foo: bar', {
		'type-enum': [2, 'always', ['foo']]
	});
	t.true(actual.valid);
});

test('negative on stub message and broken rule', t => {
	const actual = lint('foo: bar', {
		'type-enum': [2, 'never', ['foo']]
	});
	t.false(actual.valid);
});

test('positive on ignored message and broken rule', t => {
	const actual = lint('Revert "some bogus commit"', {
		'type-empty': [2, 'never']
	});
	t.true(actual.valid);
});
