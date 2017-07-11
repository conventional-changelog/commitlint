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

test('empty succeeds', async t => {
	const [actual] = footerTense(await parsed.empty, '', ['present-imperative']);
	const expected = true;
	t.is(actual, expected);
});

test('present succeeds "always present-imperative"', async t => {
	const [actual] = footerTense(await parsed.presentImperative, 'always', [
		'present-imperative'
	]);
	const expected = true;
	t.is(actual, expected);
});

test('present fails "never present-imperative"', async t => {
	const [actual] = footerTense(await parsed.presentImperative, 'never', [
		'present-imperative'
	]);
	const expected = false;
	t.is(actual, expected);
});

test('present succeeds "always present-participle"', async t => {
	const [actual] = footerTense(await parsed.presentParticiple, 'always', [
		'present-participle'
	]);
	const expected = true;
	t.is(actual, expected);
});

test('present fails "never present-participle"', async t => {
	const [actual] = footerTense(await parsed.presentParticiple, 'never', [
		'present-participle'
	]);
	const expected = false;
	t.is(actual, expected);
});

test('present succeeds "always present-third-person"', async t => {
	const [actual] = footerTense(await parsed.presentThirdPerson, 'always', [
		'present-third-person'
	]);
	const expected = true;
	t.is(actual, expected);
});

test('present fails "never present-third-person"', async t => {
	const [actual] = footerTense(await parsed.presentThirdPerson, 'never', [
		'present-third-person'
	]);
	const expected = false;
	t.is(actual, expected);
});

test('past should succedd "always past-tense"', async t => {
	const [actual] = footerTense(await parsed.past, 'always', ['past-tense']);
	const expected = true;
	t.is(actual, expected);
});

test('past fails "never past-tense"', async t => {
	const [actual] = footerTense(await parsed.past, 'never', ['past-tense']);
	const expected = false;
	t.is(actual, expected);
});

test('mixed fails "always present-third-person"', async t => {
	const [actual] = footerTense(await parsed.mixed, 'always', [
		'present-third-person'
	]);
	const expected = false;
	t.is(actual, expected);
});

test('mixed fails "always present-imperative"', async t => {
	const [actual] = footerTense(await parsed.mixed, 'always', [
		'present-imperative'
	]);
	const expected = false;
	t.is(actual, expected);
});

test('present fails "always present-participle"', async t => {
	const [actual] = footerTense(await parsed.mixed, 'always', [
		'present-participle'
	]);
	const expected = false;
	t.is(actual, expected);
});

test('mixed fails "always past-tense"', async t => {
	const [actual] = footerTense(await parsed.mixed, 'always', ['past-tense']);
	const expected = false;
	t.is(actual, expected);
});

test('mixed succeeds "always present-third-person, present-imperative, present-participle, past-tense"', async t => {
	const [actual] = footerTense(await parsed.mixed, 'always', [
		'present-third-person',
		'present-imperative',
		'present-participle',
		'past-tense'
	]);
	const expected = true;
	t.is(actual, expected);
});

test('mixed succeeds "never allowed: present-third-person" and matching ignored: implements', async t => {
	const [actual] = footerTense(await parsed.mixed, 'never', {
		allowed: ['present-third-person'],
		ignored: ['implements']
	});
	const expected = true;
	t.is(actual, expected);
});
