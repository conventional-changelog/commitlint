import importFrom from 'import-from';
import test from 'ava';
import parse from '.';

test('throws when called without params', async t => {
	const error = await t.throws(parse());
	t.is(error.message, 'Expected a raw commit');
});

test('throws when called with empty message', async t => {
	const error = await t.throws(parse());
	t.is(error.message, 'Expected a raw commit');
});

test('returns object with raw message', async t => {
	const message = 'type(scope): subject';
	const actual = await parse(message);
	t.is(actual.raw, message);
});

test('calls parser with message and passed options', async t => {
	const message = 'message';

	await parse(message, m => {
		t.is(message, m);
		return {};
	});
});

test('passes object up from parser function', async t => {
	const message = 'message';
	const result = {};
	const actual = await parse(message, () => result);
	t.is(actual, result);
});

test('returns object with expected keys', async t => {
	const message = 'message';
	const actual = await parse(message);
	const expected = {
		body: null,
		footer: null,
		header: 'message',
		mentions: [],
		merge: null,
		notes: [],
		raw: 'message',
		references: [],
		revert: null,
		scope: null,
		subject: null,
		type: null
	};
	t.deepEqual(actual, expected);
});

test('uses angular grammar', async t => {
	const message = 'type(scope): subject';
	const actual = await parse(message);
	const expected = {
		body: null,
		footer: null,
		header: 'type(scope): subject',
		mentions: [],
		merge: null,
		notes: [],
		raw: 'type(scope): subject',
		references: [],
		revert: null,
		scope: 'scope',
		subject: 'subject',
		type: 'type'
	};
	t.deepEqual(actual, expected);
});

test('uses custom opts parser', async t => {
	const message = 'type(scope)-subject';
	const changelogOpts = await importFrom(
		process.cwd(),
		'./fixtures/parser-preset/conventional-changelog-custom'
	);
	const actual = await parse(message, undefined, changelogOpts.parserOpts);
	const expected = {
		body: null,
		footer: null,
		header: 'type(scope)-subject',
		mentions: [],
		merge: null,
		notes: [],
		raw: 'type(scope)-subject',
		references: [],
		revert: null,
		scope: 'scope',
		subject: 'subject',
		type: 'type'
	};
	t.deepEqual(actual, expected);
});

test('supports scopes with /', async t => {
	const message = 'type(some/scope): subject';
	const actual = await parse(message);
	t.is(actual.scope, 'some/scope');
	t.is(actual.subject, 'subject');
});

test('supports scopes with / and empty parserOpts', async t => {
	const message = 'type(some/scope): subject';
	const actual = await parse(message, undefined, {});
	t.is(actual.scope, 'some/scope');
	t.is(actual.subject, 'subject');
});

test('ignores comments', async t => {
	const message = 'type(some/scope): subject\n# some comment';
	const changelogOpts = await importFrom(
		process.cwd(),
		'conventional-changelog-angular'
	);
	const opts = Object.assign({}, changelogOpts.parserOpts, {commentChar: '#'});
	const actual = await parse(message, undefined, opts);
	t.is(actual.body, null);
	t.is(actual.footer, null);
	t.is(actual.subject, 'subject');
});

test('registers inline #', async t => {
	const message =
		'type(some/scope): subject #reference\n# some comment\nthings #reference';
	const changelogOpts = await importFrom(
		process.cwd(),
		'conventional-changelog-angular'
	);
	const opts = Object.assign({}, changelogOpts.parserOpts, {commentChar: '#'});
	const actual = await parse(message, undefined, opts);
	t.is(actual.subject, 'subject #reference');
	t.is(actual.body, 'things #reference');
});

test('parses references leading subject', async t => {
	const message = '#1 some subject';
	const opts = await importFrom(
		process.cwd(),
		'conventional-changelog-angular'
	);
	const {references: [actual]} = await parse(message, undefined, opts);
	t.is(actual.issue, '1');
});

test('parses custom references', async t => {
	const message = '#1 some subject PREFIX-2';
	const {references} = await parse(message, undefined, {
		issuePrefixes: ['PREFIX-']
	});

	t.falsy(references.find(ref => ref.issue === '1'));
	t.deepEqual(references.find(ref => ref.issue === '2'), {
		action: null,
		issue: '2',
		owner: null,
		prefix: 'PREFIX-',
		raw: '#1 some subject PREFIX-2',
		repository: null
	});
});

test('uses permissive default regex without parser opts', async t => {
	const message = 'chore(component,demo): bump';
	const actual = await parse(message);

	t.is(actual.scope, 'component,demo');
});

test('uses permissive default regex with other parser opts', async t => {
	const message = 'chore(component,demo): bump';
	const actual = await parse(message, undefined, {commentChar: '#'});

	t.is(actual.scope, 'component,demo');
});

test('uses restrictive default regex in passed parser opts', async t => {
	const message = 'chore(component,demo): bump';
	const actual = await parse(message, undefined, {
		headerPattern: /^(\w*)(?:\(([a-z]*)\))?: (.*)$/
	});

	t.is(actual.subject, null);
	t.is(actual.message, undefined);
	t.is(actual.scope, null);
});
