import test from 'ava';
import parse from '@commitlint/parse';
import bodyTense from './body-tense';

test('returns deprecation warning', async t => {
	const actual = bodyTense(await parse('test: \n'), 'always', [
		'present-imperative'
	]);
	t.deepEqual(actual, [
		false,
		'rules.body-tense is deprecated. Received [always, [present-imperative]]'
	]);
});
