import test from 'ava';
import parse from '../../source/library/parse';
import footerEmpty from '../../source/rules/footer-empty';

const messages = {
	simple: 'chore: subject',
	empty: 'chore: subject\nbody',
	filled: 'chore: subject\nBREAKING CHANGE: something important'
};

const parsed = {
	simple: parse(messages.simple),
	empty: parse(messages.empty),
	filled: parse(messages.filled)
};

test('footer-empty with simple message should succeed for empty keyword', t => {
	const [actual] = footerEmpty(parsed.simple);
	const expected = true;
	t.is(actual, expected);
});

test('footer-empty with simple message should fail for "never"', t => {
	const [actual] = footerEmpty(parsed.simple, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('footer-empty with simple message should succeed for "always"', t => {
	const [actual] = footerEmpty(parsed.simple, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('footer-empty with empty footer should succeed for empty keyword', t => {
	const [actual] = footerEmpty(parsed.empty);
	const expected = true;
	t.is(actual, expected);
});

test('footer-empty with empty footer should fail for "never"', t => {
	const [actual] = footerEmpty(parsed.empty, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('footer-empty with empty footer should succeed for "always"', t => {
	const [actual] = footerEmpty(parsed.empty, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('footer-empty with footer should fail for empty keyword', t => {
	const [actual] = footerEmpty(parsed.filled);
	const expected = false;
	t.is(actual, expected);
});

test('footer-empty with footer should succeed for "never"', t => {
	const [actual] = footerEmpty(parsed.filled, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('footer-empty with footer should fail for "always"', t => {
	const [actual] = footerEmpty(parsed.filled, 'always');
	const expected = false;
	t.is(actual, expected);
});
