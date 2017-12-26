import test from 'ava';
import parse from '@commitlint/parse';
import subjectTense from './subject-tense';

test('returns deprecation warning', async t => {
	const actual = subjectTense(await parse('test: '), 'always', [
		'present-imperative'
	]);
	t.deepEqual(actual, [
		false,
		'rules.subject-tense is deprecated. Received [always, [present-imperative]]'
	]);
});
