import test from 'ava';
import parse from '@commitlint/parse';
import footerTense from './footer-tense';

test('returns deprecation warning', async t => {
	const actual = footerTense(await parse('test: subject\nbody'), 'always', [
		'present-imperative'
	]);
	t.deepEqual(actual, [
		false,
		'rules.footer-tense is deprecated. Received [always, [present-imperative]]'
	]);
});
