import test from 'ava';
import parse from '../library/parse';
import footerContains from './footer-contains';

const messages = {
	empty: 'foo(bar): baz',
	matched: 'foo(bar): baz\n\nbody\n\nqux',
	unmatched: 'foo(bar): baz\n\nbody\n\nquux'
};

const parsed = {
	empty: parse(messages.empty),
	matched: parse(messages.matched),
	unmatched: parse(messages.unmatched)
};

test('footer-contains with no footer should not succeed', async t => {
	const [actual] = footerContains(await parsed.empty, 'always', /qux$/gi);
	const expected = false;
	t.deepEqual(actual, expected);
});

test('footer-contains with matching footer should succeed', async t => {
	const [actual] = footerContains(await parsed.matched, 'always', /qux$/gi);
	const expected = true;
	t.deepEqual(actual, expected);
});

test('footer-contains with non-matching footer should not succeed', async t => {
	const [actual] = footerContains(await parsed.unmatched, 'always', /qux$/gi);
	const expected = false;
	t.deepEqual(actual, expected);
});
