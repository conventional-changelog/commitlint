import test from 'ava';
import parse from '../../source/library/parse';
import subjectEmpty from '../../source/rules/subject-empty';

const messages = {
	empty: 'chore: \nbody',
	filled: 'chore: subject\nbody'
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled)
};

test.failing('subject-empty without subject should succeed for empty keyword', t => {
	const [actual] = subjectEmpty(parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('subject-empty without subject should fail for "never"', t => {
	const [actual] = subjectEmpty(parsed.empty, 'never');
	const expected = false;
	t.is(actual, expected);
});

test.failing('subject-empty without subject should succeed for "always"', t => {
	const [actual] = subjectEmpty(parsed.empty, 'always');
	const expected = true;
	t.is(actual, expected);
});

test.failing('subject-empty with subject fail for empty keyword', t => {
	const [actual] = subjectEmpty(parsed.filled);
	const expected = false;
	t.is(actual, expected);
});

test('subject-empty with subject succeed for "never"', t => {
	const [actual] = subjectEmpty(parsed.filled, 'never');
	const expected = true;
	t.is(actual, expected);
});

test.failing('subject-empty with subject fail for "always"', t => {
	const [actual] = subjectEmpty(parsed.filled, 'always');
	const expected = false;
	t.is(actual, expected);
});
