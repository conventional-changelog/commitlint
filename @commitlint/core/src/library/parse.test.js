import importFrom from 'import-from';
import {sync} from '@marionebl/conventional-commits-parser';
import angular from 'conventional-changelog-angular';

import test from 'ava';
import parse from './parse';

test('throws when called without params', async t => {
	const error = await t.throws(parse());
	t.is(error.message, 'Expected a raw commit');
});

test('throws when called with empty message', async t => {
	const error = await t.throws(parse());
	t.is(error.message, 'Expected a raw commit');
});

test('returns object with raw message', async t => {
	const {parserOpts} = await angular;
	const message = 'type(scope): subject';
	const actual = await parse(message, sync, parserOpts);
	t.is(actual.raw, message);
});

test('calls parser with message and passed options', async t => {
	const message = 'message';
	const {parserOpts} = await angular;

	await parse(
		message,
		m => {
			t.is(message, m);
			return {};
		},
		parserOpts
	);
});

test('passes object up from parser function', async t => {
	const message = 'message';
	const {parserOpts} = await angular;

	const result = {};
	const actual = await parse(message, () => result, parserOpts);
	t.is(actual, result);
});

test('returns object with expected keys', async t => {
	const message = 'message';
	const {parserOpts} = await angular;

	const actual = await parse(message, sync, parserOpts);
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
	const {parserOpts} = await angular;

	const actual = await parse(message, sync, parserOpts);
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
	const {parserOpts} = await angular;

	const actual = await parse(message, sync, parserOpts);
	t.is(actual.scope, 'some/scope');
	t.is(actual.subject, 'subject');
});

test('ignores comments', async t => {
	const message = 'type(some/scope): subject\n# some comment';
	const {parserOpts} = await angular;

	const actual = await parse(message, sync, parserOpts);
	t.is(actual.body, null);
	t.is(actual.footer, null);
	t.is(actual.subject, 'subject');
});

test('registers inline #', async t => {
	const message =
		'type(some/scope): subject #reference\n# some comment\nthings #reference';
	const {parserOpts} = await angular;
	const actual = await parse(message, sync, parserOpts);
	t.is(actual.subject, 'subject #reference');
	t.is(actual.body, 'things #reference');
});
