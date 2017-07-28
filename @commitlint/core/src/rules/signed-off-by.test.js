import test from 'ava';
import parse from '../library/parse';
import check from './signed-off-by';

const messages = {
	empty: 'chore:\n',
	with: `chore: subject\nbody\nfooter\nSigned-off-by:\n\n`,
	without: `chore: subject\nbody\nfooter\n\n`,
	inSubject: `chore: subject Signed-off-by:\nbody\nfooter\n\n`,
	inBody: `chore: subject\nbody Signed-off-by:\nfooter\n\n`
};

const parsed = {
	empty: parse(messages.empty),
	with: parse(messages.with),
	without: parse(messages.without),
	inSubject: parse(messages.inSubject),
	inBody: parse(messages.inBody)
};

test('empty against "always signed-off-by" should fail', async t => {
	const [actual] = check(await parsed.empty, 'always', 'Signed-off-by:');
	const expected = false;
	t.is(actual, expected);
});

test('empty against "never signed-off-by" should succeed', async t => {
	const [actual] = check(await parsed.empty, 'never', 'Signed-off-by:');
	const expected = true;
	t.is(actual, expected);
});

test('with against "always signed-off-by" should succeed', async t => {
	const [actual] = check(await parsed.with, 'always', 'Signed-off-by:');
	const expected = true;
	t.is(actual, expected);
});

test('with against "never signed-off-by" should fail', async t => {
	const [actual] = check(await parsed.with, 'never', 'Signed-off-by:');
	const expected = false;
	t.is(actual, expected);
});

test('without against "always signed-off-by" should fail', async t => {
	const [actual] = check(await parsed.without, 'always', 'Signed-off-by:');
	const expected = false;
	t.is(actual, expected);
});

test('without against "never signed-off-by" should succeed', async t => {
	const [actual] = check(await parsed.without, 'never', 'Signed-off-by:');
	const expected = true;
	t.is(actual, expected);
});

test('inSubject against "always signed-off-by" should fail', async t => {
	const [actual] = check(await parsed.inSubject, 'always', 'Signed-off-by:');
	const expected = false;
	t.is(actual, expected);
});

test('inSubject against "never signed-off-by" should succeed', async t => {
	const [actual] = check(await parsed.inSubject, 'never', 'Signed-off-by:');
	const expected = true;
	t.is(actual, expected);
});

test('inBody against "always signed-off-by" should fail', async t => {
	const [actual] = check(await parsed.inBody, 'always', 'Signed-off-by:');
	const expected = false;
	t.is(actual, expected);
});

test('inBody against "never signed-off-by" should succeed', async t => {
	const [actual] = check(await parsed.inBody, 'never', 'Signed-off-by:');
	const expected = true;
	t.is(actual, expected);
});
