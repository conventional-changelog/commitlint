import test from 'ava';
import parse from '../library/parse';
import referencesEmpty from './references-empty';

const messages = {
	plain: 'foo: bar',
	comment: 'foo: baz\n#1 Comment',
	reference: '#comment\nfoo: baz \nCloses #1',
	references: '#comment\nfoo: bar \nCloses #1, #2, #3',
	issue: 'foo: bar #1'
};

const parsed = {
	plain: parse(messages.plain),
	comment: parse(messages.comment),
	reference: parse(messages.reference),
	references: parse(messages.references),
	issue: parse(messages.issue)
};

test('defaults to never and fails for plain', async t => {
	const [actual] = referencesEmpty(await parsed.plain);
	const expected = false;
	t.is(actual, expected);
});

test('defaults to never and succeeds for reference', async t => {
	const [actual] = referencesEmpty(await parsed.reference);
	const expected = true;
	t.is(actual, expected);
});

test('fails for comment with never', async t => {
	const [actual] = referencesEmpty(await parsed.comment, 'never');
	const expected = false;
	t.is(actual, expected);
});

test('succeeds for comment with always', async t => {
	const [actual] = referencesEmpty(await parsed.comment, 'always');
	const expected = true;
	t.is(actual, expected);
});

test('succeeds for reference with never', async t => {
	const [actual] = referencesEmpty(await parsed.reference, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('fails for reference with always', async t => {
	const [actual] = referencesEmpty(await parsed.reference, 'always');
	const expected = false;
	t.is(actual, expected);
});

test('succeeds for references with never', async t => {
	const [actual] = referencesEmpty(await parsed.references, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('fails for references with always', async t => {
	const [actual] = referencesEmpty(await parsed.references, 'always');
	const expected = false;
	t.is(actual, expected);
});

test.failing('succeeds for issue with never', async t => {
	const [actual] = referencesEmpty(await parsed.issue, 'never');
	const expected = true;
	t.is(actual, expected);
});

test.failing('fails for issue with always', async t => {
	const [actual] = referencesEmpty(await parsed.issue, 'always');
	const expected = false;
	t.is(actual, expected);
});
