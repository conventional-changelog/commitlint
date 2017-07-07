import test from 'ava';
import ensure from './ensure-tense';

test('true for empty', t => {
	const actual = ensure('', []);
	t.is(actual.matches, true);
});

test.failing('true for past-tense against past-tense', t => {
	const actual = ensure('implemented', ['past-tense']);
	t.is(actual.matches, true);
});

test('true for present-imperative against present-imperative', t => {
	const actual = ensure('implement', ['present-imperative']);
	t.is(actual.matches, true);
});

test('true for present-participle against present-participle', t => {
	const actual = ensure('implementing', ['present-participle']);
	t.is(actual.matches, true);
});

test('true for present-third-person against present-third-person', t => {
	const actual = ensure('implements', ['present-third-person']);
	t.is(actual.matches, true);
});

test('false for past-tense against present-third-person', t => {
	const actual = ensure('implemented', ['present-third-person']);
	t.is(actual.matches, false);
	t.deepEqual(actual.offending, [
		{lemma: 'implemented', tense: 'present-imperative'}
	]);
});

test.failing('false for present-imperative against past-tense', t => {
	const actual = ensure('implement', ['past-tense']);
	t.is(actual.matches, false);
	t.deepEqual(actual.offending, [
		{lemma: 'implement', tense: 'present-imperative'}
	]);
});

test('false for present-participle against present-third-person', t => {
	const actual = ensure('implementing', ['present-third-person']);
	t.is(actual.matches, false);
	t.deepEqual(actual.offending, [
		{lemma: 'implementing', tense: 'present-participle'}
	]);
});

test.failing('false for present-third-person against past-tense', t => {
	const actual = ensure('implements', ['past-tense']);
	t.is(actual.matches, false);
	t.deepEqual(actual.offending, [
		{lemma: 'implements', tense: 'present-third-person'}
	]);
});
