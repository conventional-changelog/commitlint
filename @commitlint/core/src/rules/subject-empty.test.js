import test from 'ava';
import parse from '../library/parse';
import subjectEmpty from './subject-empty';

const messages = {
	empty: 'chore: \nbody',
	filled: 'chore: subject\nbody'
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled)
};

test('without subject should succeed for empty keyword', async t => {
	const [actual] = subjectEmpty(await parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('without subject should fail for "never"', async t => {
	const [actual] = subjectEmpty(await parsed.empty, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('without subject should succeed for "always"', async t => {
	const [actual] = subjectEmpty(await parsed.empty, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('with subject fail for empty keyword', async t => {
	const [actual] = subjectEmpty(await parsed.filled);
	const expected = false;
	t.is(actual, expected);
});

test('with subject succeed for "never"', async t => {
	const [actual] = subjectEmpty(await parsed.filled, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('with subject fail for "always"', async t => {
	const [actual] = subjectEmpty(await parsed.filled, 'always');
	const expected = false;
	t.is(actual, expected);
});
