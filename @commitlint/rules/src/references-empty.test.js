import test from 'ava';
import preset from 'conventional-changelog-angular';
import parse from '@commitlint/parse';
import referencesEmpty from './references-empty';

const messages = {
	plain: 'foo: bar',
	comment: 'foo: baz\n#1 Comment',
	reference: '#comment\nfoo: baz \nCloses #1',
	references: '#comment\nfoo: bar \nCloses #1, #2, #3',
	prefix: 'bar REF-1234'
};

const opts = (async () => {
	const o = await preset;
	o.parserOpts.commentChar = '#';
	return o;
})();

const parsed = {
	plain: (async () =>
		parse(messages.plain, undefined, (await opts).parserOpts))(),
	comment: (async () =>
		parse(messages.comment, undefined, (await opts).parserOpts))(),
	reference: (async () =>
		parse(messages.reference, undefined, (await opts).parserOpts))(),
	references: (async () =>
		parse(messages.references, undefined, (await opts).parserOpts))(),
	prefix: parse(messages.prefix, undefined, {
		issuePrefixes: ['REF-']
	})
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

test('succeeds for custom references with always', async t => {
	const [actual] = referencesEmpty(await parsed.prefix, 'never');
	const expected = true;
	t.is(actual, expected);
});

test('plain with foo type should fail for "never [foo]"', async t => {
	const [actual] = referencesEmpty(await parsed.plain, 'never', ['foo']);
	const expected = false;
	t.is(actual, expected);
});

test('plain with foo type should succeed for "never [bar]"', async t => {
	const [actual] = referencesEmpty(await parsed.plain, 'never', ['bar']);
	const expected = true;
	t.is(actual, expected);
});
