import test from 'ava';
import parse from '../library/parse';
import footerTense from './footer-tense';

const messages = {
	empty: 'chore: subject\nbody',
	presentImperative: `chore: subject\nBREAKING CHANGE: we implement things`,
	presentParticiple: `chore: subject\nBREAKING CHANGE: implementing things`,
	presentThirdPerson: `chore: subject\nBREAKING CHANGE: implements things`,
	past: `chore: subject\nBREAKING CHANGE: we did implement things`,
	mixed: `chore: subject\nBREAKING CHANGE: implement, implementing, implements, implemented`
};

const parsed = {
	empty: parse(messages.empty),
	presentImperative: parse(messages.presentImperative),
	presentParticiple: parse(messages.presentParticiple),
	presentThirdPerson: parse(messages.presentImperative),
	past: parse(messages.past),
	mixed: parse(messages.mixed)
};

test('with empty footer should succeed', t => {
	const [actual] = footerTense(parsed.empty, '', ['present-imperative']);
	const expected = true;
	t.is(actual, expected);
});

test('with present footer should succeed for "always present-imperative"', t => {
	const [actual] = footerTense(parsed.presentImperative, 'always', ['present-imperative']);
	const expected = true;
	t.is(actual, expected);
});

test('with present footer should fail for "never present-imperative"', t => {
	const [actual] = footerTense(parsed.presentImperative, 'never', ['present-imperative']);
	const expected = false;
	t.is(actual, expected);
});

test('with present footer should succeed for "always present-participle"', t => {
	const [actual] = footerTense(parsed.presentParticiple, 'always', ['present-participle']);
	const expected = true;
	t.is(actual, expected);
});

test('with present footer should fail for "never present-participle"', t => {
	const [actual] = footerTense(parsed.presentParticiple, 'never', ['present-participle']);
	const expected = false;
	t.is(actual, expected);
});

test('with present footer should succeed for "always present-third-person"', t => {
	const [actual] = footerTense(parsed.presentThirdPerson, 'always', ['present-third-person']);
	const expected = true;
	t.is(actual, expected);
});

test('with present footer should fail for "never present-third-person"', t => {
	const [actual] = footerTense(parsed.presentThirdPerson, 'never', ['present-third-person']);
	const expected = false;
	t.is(actual, expected);
});

test('with past footer should succedd for "always past-tense"', t => {
	const [actual] = footerTense(parsed.past, 'always', ['past-tense']);
	const expected = true;
	t.is(actual, expected);
});

test('with past footer should fail for "never past-tense"', t => {
	const [actual] = footerTense(parsed.past, 'never', ['past-tense']);
	const expected = false;
	t.is(actual, expected);
});

test('with mixed footer should fail for "always present-third-person"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['present-third-person']);
	const expected = false;
	t.is(actual, expected);
});

test('with mixed footer should fail for "always present-imperative"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['present-imperative']);
	const expected = false;
	t.is(actual, expected);
});

test('with present footer should fail for "always present-participle"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['present-participle']);
	const expected = false;
	t.is(actual, expected);
});

test('with mixed footer should fail for "always past-tense"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['past-tense']);
	const expected = false;
	t.is(actual, expected);
});

test('with mixed footer should succeed for "always present-third-person, present-imperative, present-participle, past-tense"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['present-third-person', 'present-imperative', 'present-participle', 'past-tense']);
	const expected = true;
	t.is(actual, expected);
});

test('with mixed footer should succeed for "never allowed: present-third-person" and matching ignored: implements', t => {
	const [actual] = footerTense(parsed.mixed, 'never', {
		allowed: ['present-third-person'],
		ignored: ['implements']
	});
	const expected = true;
	t.is(actual, expected);
});
