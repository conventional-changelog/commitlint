import ensure from './not-empty';

test('false for no params', () => {
	const actual = (ensure as () => boolean)();
	expect(actual).toBe(false);
});

test('false for ""', () => {
	const actual = ensure('');
	expect(actual).toBe(false);
});

test('true for a', () => {
	const actual = ensure('a');
	expect(actual).toBe(true);
});
