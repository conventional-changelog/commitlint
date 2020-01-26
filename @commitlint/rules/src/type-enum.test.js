import parse from '@commitlint/parse';
import check from './type-enum';

const messages = {
	empty: '(): \n',
	a: 'a(): \n',
	b: 'b(): \n'
};

const parsed = {
	empty: parse(messages.empty),
	a: parse(messages.a),
	b: parse(messages.b)
};

test('empty succeeds', async () => {
	const [actual] = check(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('empty on "a" succeeds', async () => {
	const [actual] = check(await parsed.empty, '', ['a']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('empty on "always a" succeeds', async () => {
	const [actual] = check(await parsed.empty, 'always', ['a']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('empty on "never a" succeeds', async () => {
	const [actual] = check(await parsed.empty, 'never', ['a']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('empty on "always a, b" succeeds', async () => {
	const [actual] = check(await parsed.empty, 'always', ['a', 'b']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('empty on "never a, b" succeeds', async () => {
	const [actual] = check(await parsed.empty, 'neber', ['a', 'b']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('a on "a" succeeds', async () => {
	const [actual] = check(await parsed.a, '', ['a']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('a on "always a" succeeds', async () => {
	const [actual] = check(await parsed.a, 'always', ['a']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('a on "never a" fails', async () => {
	const [actual] = check(await parsed.a, 'never', ['a']);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('b on "b" succeeds', async () => {
	const [actual] = check(await parsed.b, '', ['b']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('b on "always b" succeeds', async () => {
	const [actual] = check(await parsed.b, 'always', ['b']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('b on "never b" fails', async () => {
	const [actual] = check(await parsed.b, 'never', ['b']);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('a on "a, b" succeeds', async () => {
	const [actual] = check(await parsed.a, '', ['a', 'b']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('a on "always a, b" succeeds', async () => {
	const [actual] = check(await parsed.a, 'always', ['a', 'b']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('a on "never a, b" fails', async () => {
	const [actual] = check(await parsed.a, 'never', ['a', 'b']);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('b on "a, b" succeeds', async () => {
	const [actual] = check(await parsed.b, '', ['a', 'b']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('b on "always a, b" succeeds', async () => {
	const [actual] = check(await parsed.b, 'always', ['a', 'b']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('b on "never a, b" fails', async () => {
	const [actual] = check(await parsed.b, 'never', ['a', 'b']);
	const expected = false;
	expect(actual).toEqual(expected);
});
