import test from 'ava';
import parse from '../library/parse';
import footerTense from './footer-tense';

test('returns deprecation warning', async t => {
	const actual = footerTense(await parse('chore: subject\nbody'), 'always', [
		'present-imperative'
	]);
	t.deepEqual(actual, [
		false,
		'rules.footer-tense is deprecated. Received [always, [present-imperative]]'
	]);
});
