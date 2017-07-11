import test from 'ava';
import parse from '../library/parse';
import subjectCase from './subject-case';

const messages = {
	empty: 'chore:\n',
	lowercase: 'chore: subject',
	mixedcase: 'chore: sUbJeCt',
	uppercase: 'chore: SUBJECT'
};

const parsed = {
	empty: parse(messages.empty),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase)
};

test('with empty subject should succeed for "never lowercase"', async t => {
	const [actual] = subjectCase(await parsed.empty, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty subject should succeed for "always lowercase"', async t => {
	const [actual] = subjectCase(await parsed.empty, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty subject should succeed for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty subject should succeed for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with lowercase subject should fail for "never lowercase"', async t => {
	const [actual] = subjectCase(await parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase subject should succeed for "always lowercase"', async t => {
	const [actual] = subjectCase(await parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should succeed for "never lowercase"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should fail for "always lowercase"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with mixedcase subject should succeed for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should fail for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with uppercase subject should fail for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase subject should succeed for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
