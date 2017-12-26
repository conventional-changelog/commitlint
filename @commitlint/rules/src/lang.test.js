import test from 'ava';
import parse from '@commitlint/parse';
import check from './lang';

test('returns a deprecation warning', async t => {
	const actual = check(
		await parse('(): this is a serious subject'),
		'always',
		'eng'
	);
	t.deepEqual(actual, [
		false,
		'rules.lang is deprecated. Received [always, eng]'
	]);
});
