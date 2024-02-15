import {test, expect} from 'vitest';
import parse from '@commitlint/parse';
import {scopeEmpty} from './scope-empty.js';

const messages = {
	plain: 'foo(bar): baz',
	superfluous: 'foo(): baz',
	empty: 'foo: baz',
};

const parsed = {
	plain: parse(messages.plain),
	superfluous: parse(messages.superfluous),
	empty: parse(messages.empty),
};

test('with plain message it should succeed for empty keyword', async () => {
	const [actual] = scopeEmpty(await parsed.plain);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with plain message it should succeed for "never"', async () => {
	const [actual] = scopeEmpty(await parsed.plain, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with plain message it should fail for "always"', async () => {
	const [actual] = scopeEmpty(await parsed.plain, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with superfluous message it should fail for empty keyword', async () => {
	const [actual] = scopeEmpty(await parsed.superfluous);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with superfluous message it should fail for "never"', async () => {
	const [actual] = scopeEmpty(await parsed.superfluous, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with superfluous message it should fail for "always"', async () => {
	const [actual] = scopeEmpty(await parsed.superfluous, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty message it should fail for empty keyword', async () => {
	const [actual] = scopeEmpty(await parsed.empty);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with empty message it should fail for "never"', async () => {
	const [actual] = scopeEmpty(await parsed.empty, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with empty message it should fail for "always"', async () => {
	const [actual] = scopeEmpty(await parsed.empty, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});
