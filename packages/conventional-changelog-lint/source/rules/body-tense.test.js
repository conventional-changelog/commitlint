import test from 'ava';
import parse from '../library/parse';
import footerTense from './body-tense';

const messages = {
	empty: 'chore: \n',
	presentImperative: `chore: \nwe implement things`,
	presentParticiple: `chore: \nimplementing things`,
	presentThirdPerson: `chore: \nimplements things`,
	past: `chore: \nwe did implement things`,
	mixed: `chore: \nimplement, implementing, implements, implemented`
};

const parsed = {
	empty: parse(messages.empty),
	presentImperative: parse(messages.presentImperative),
	presentParticiple: parse(messages.presentParticiple),
	presentThirdPerson: parse(messages.presentImperative),
	past: parse(messages.past),
	mixed: parse(messages.mixed)
};

test('empty succeeds', t => {
	const [actual] = footerTense(parsed.empty, '', ['present-imperative']);
	const expected = true;
	t.is(actual, expected);
});

test('present succeeds "always present-imperative"', t => {
	const [actual] = footerTense(parsed.presentImperative, 'always', ['present-imperative']);
	const expected = true;
	t.is(actual, expected);
});

test('present fails "never present-imperative"', t => {
	const [actual] = footerTense(parsed.presentImperative, 'never', ['present-imperative']);
	const expected = false;
	t.is(actual, expected);
});

test('present succeeds "always present-participle"', t => {
	const [actual] = footerTense(parsed.presentParticiple, 'always', ['present-participle']);
	const expected = true;
	t.is(actual, expected);
});

test('present fails "never present-participle"', t => {
	const [actual] = footerTense(parsed.presentParticiple, 'never', ['present-participle']);
	const expected = false;
	t.is(actual, expected);
});

test('present succeeds "always present-third-person"', t => {
	const [actual] = footerTense(parsed.presentThirdPerson, 'always', ['present-third-person']);
	const expected = true;
	t.is(actual, expected);
});

test('present fails "never present-third-person"', t => {
	const [actual] = footerTense(parsed.presentThirdPerson, 'never', ['present-third-person']);
	const expected = false;
	t.is(actual, expected);
});

test('past should succedd "always past-tense"', t => {
	const [actual] = footerTense(parsed.past, 'always', ['past-tense']);
	const expected = true;
	t.is(actual, expected);
});

test('past fails "never past-tense"', t => {
	const [actual] = footerTense(parsed.past, 'never', ['past-tense']);
	const expected = false;
	t.is(actual, expected);
});

test('mixed fails "always present-third-person"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['present-third-person']);
	const expected = false;
	t.is(actual, expected);
});

test('mixed fails "always present-imperative"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['present-imperative']);
	const expected = false;
	t.is(actual, expected);
});

test('present fails "always present-participle"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['present-participle']);
	const expected = false;
	t.is(actual, expected);
});

test('mixed fails "always past-tense"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['past-tense']);
	const expected = false;
	t.is(actual, expected);
});

test('mixed succeeds "always present-third-person, present-imperative, present-participle, past-tense"', t => {
	const [actual] = footerTense(parsed.mixed, 'always', ['present-third-person', 'present-imperative', 'present-participle', 'past-tense']);
	const expected = true;
	t.is(actual, expected);
});

test('mixed succeeds "never allowed: present-third-person" and matching ignored: implements', t => {
	const [actual] = footerTense(parsed.mixed, 'never', {
		allowed: ['present-third-person'],
		ignored: ['implements']
	});
	const expected = true;
	t.is(actual, expected);
});
