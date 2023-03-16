import parse from '@commitlint/parse';
import {subjectEmpty} from './subject-empty';

const messages = {
	empty: 'test: \nbody',
	filled: 'test: subject\nbody',
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled),
};

test('without subject should succeed for empty keyword', async () => {
	const [actual] = subjectEmpty(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without subject should fail for "never"', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without subject should fail for "never" and any types', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'never', []);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without subject should succeed for "never" and a non matched type', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'never', ['other']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without subject should fail for "never" and a matched type', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'never', ['test']);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without subject should succeed for "always"', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without subject should succeed for "always" and any types', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'always', []);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without subject should succeed for "always" and a non matched type', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'always', ['other']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without subject should succeed for "always" and a matched type', async () => {
	const [actual] = subjectEmpty(await parsed.empty, 'always', ['test']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with subject fail for empty keyword', async () => {
	const [actual] = subjectEmpty(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with subject succeed for "never"', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with subject succeed for "never" and any types', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'never', []);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with subject succeed for "never" and a non matched type', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'never', ['other']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with subject succeed for "never" and a matched type', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'never', ['test']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with subject fail for "always"', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with subject fail for "always" and any types', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'always', []);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with subject succeed for "always" and a non matched type', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'always', ['other']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with subject fail for "always" and a matched type', async () => {
	const [actual] = subjectEmpty(await parsed.filled, 'always', ['test']);
	const expected = false;
	expect(actual).toEqual(expected);
});
