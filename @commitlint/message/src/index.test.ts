import {test, expect} from 'vitest';

import message from './index.js';

test('should return an empty string for empty input', () => {
	expect(message()).toBe('');
});

test('should return an empty string for empty input array', () => {
	expect(message([])).toBe('');
});

test('should filter falsy values', () => {
	expect(message([null, 'some', undefined, 'message', null])).toBe(
		'some message'
	);
});
