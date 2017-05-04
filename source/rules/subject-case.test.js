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

test.failing('with empty subject should succeed for "never lowercase"', t => {
	const [actual] = subjectCase(parsed.empty, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty subject should succeed for "always lowercase"', t => {
	const [actual] = subjectCase(parsed.empty, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty subject should succeed for "never uppercase"', t => {
	const [actual] = subjectCase(parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test.failing('with empty subject should succeed for "always uppercase"', t => {
	const [actual] = subjectCase(parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with lowercase subject should fail for "never lowercase"', t => {
	const [actual] = subjectCase(parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase subject should succeed for "always lowercase"', t => {
	const [actual] = subjectCase(parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should succeed for "never lowercase"', t => {
	const [actual] = subjectCase(parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should fail for "always lowercase"', t => {
	const [actual] = subjectCase(parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with mixedcase subject should succeed for "never uppercase"', t => {
	const [actual] = subjectCase(parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should fail for "always uppercase"', t => {
	const [actual] = subjectCase(parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with uppercase subject should fail for "never uppercase"', t => {
	const [actual] = subjectCase(parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase subject should succeed for "always uppercase"', t => {
	const [actual] = subjectCase(parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
