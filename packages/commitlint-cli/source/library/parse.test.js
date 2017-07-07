import test from 'ava';
import parse from './parse';

test('throws when called without params', t => {
	t.throws(() => parse(), /Expected a raw commit/);
});

test('throws when called with empty message', t => {
	t.throws(() => parse(''), /Expected a raw commit/);
});

test('returns object with raw message', t => {
	const message = 'type(scope): subject';
	const actual = parse(message);
	t.is(actual.raw, message);
});

test('calls parser with message and passed options', t => {
	const message = 'message';
	const options = {};

	parse(message, options, (m, o) => {
		t.is(message, m);
		t.is(options, o);
		return {};
	});
});

test('passes object up from parser function', t => {
	const message = 'message';
	const options = {};
	const result = {};
	const actual = parse(message, options, () => result);
	t.is(actual, result);
});
