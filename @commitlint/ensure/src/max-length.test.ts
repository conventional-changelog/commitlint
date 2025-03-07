import {test, expect} from 'vitest';

import ensure from './max-length.js';

test('false for no params', () => {
	const actual = (ensure as () => boolean)();
	expect(actual).toBe(false);
});

test('true for a against 1', () => {
	const actual = ensure('a', 1);
	expect(actual).toBe(true);
});

test('false for ab against 0', () => {
	const actual = ensure('a', 0);
	expect(actual).toBe(false);
});

test('true for a against 2', () => {
	const actual = ensure('a', 2);
	expect(actual).toBe(true);
});

test('true for ab against 2', () => {
	const actual = ensure('ab', 2);
	expect(actual).toBe(true);
});
