import importFrom from 'import-from';
import test from 'ava';
import parse from './parse';

test('throws when called without params', t => {
	t.throws(parse(), /Expected a raw commit/);
});

test('throws when called with empty message', t => {
	t.throws(parse(''), /Expected a raw commit/);
});

test('returns object with raw message', async t => {
	const message = 'type(scope): subject';
	const actual = await parse(message);
	t.is(actual.raw, message);
});

test('calls parser with message and passed options', t => {
	const message = 'message';

	parse(message, m => {
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
