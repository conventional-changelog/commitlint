import test from 'ava';
import message from './message';

test('should return an empty string for empty input', t => {
	t.deepEqual(message(), '');
});

test('should return an empty string for empty input array', t => {
	t.deepEqual(message([]), '');
});

test('should filter falsy values', t => {
	t.deepEqual(message([null, 'some', null, 'message', null]), 'some message');
});
