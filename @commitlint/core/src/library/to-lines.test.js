import test from 'ava';
import toLines from './to-lines';

test('should return an array for empty input', t => {
	t.deepEqual(toLines(), []);
});

test('should return an array for null input', t => {
	t.deepEqual(toLines(null), []);
});

test('should return an array for empty string input', t => {
	t.deepEqual(toLines(''), ['']);
});

test('should split LF newlines', t => {
	t.deepEqual(toLines('some\nweird\ntext'), ['some', 'weird', 'text']);
});

test('should split CR+LF newlines', t => {
	t.deepEqual(toLines('some\r\nweird\r\ntext'), ['some', 'weird', 'text']);
});
