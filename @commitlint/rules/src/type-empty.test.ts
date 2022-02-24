import parse from '@commitlint/parse';
import {typeEmpty} from './type-empty';

const messages = {
	empty: '(scope):',
	filled: 'type: subject',
	subjectOnly: 'subject',
	separator: ': subject',
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled),
	subjectOnly: parse(messages.subjectOnly),
	separator: parse(messages.separator),
};

test('without type should succeed for empty keyword', async () => {
	const [actual] = typeEmpty(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without type should fail for "never"', async () => {
	const [actual] = typeEmpty(await parsed.empty, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without type should succeed for "always"', async () => {
	const [actual] = typeEmpty(await parsed.empty, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with type fail for empty keyword', async () => {
	const [actual] = typeEmpty(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with type succeed for "never"', async () => {
	const [actual] = typeEmpty(await parsed.filled, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with type fail for "always"', async () => {
	const [actual] = typeEmpty(await parsed.filled, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with only subject should succeed for empty keyword', async () => {
	const [actual] = typeEmpty(await parsed.subjectOnly);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with only subject should fail for "never"', async () => {
	const [actual] = typeEmpty(await parsed.subjectOnly, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with only subject should succeed for "always"', async () => {
	const [actual] = typeEmpty(await parsed.subjectOnly, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without type but with a separator should fail for empty keyword', async () => {
	const [actual] = typeEmpty(await parsed.separator);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without type but with a separator should succeed for "never"', async () => {
	const [actual] = typeEmpty(await parsed.separator, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without type but with a separator should fail for "always"', async () => {
	const [actual] = typeEmpty(await parsed.separator, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});
