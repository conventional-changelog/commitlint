import path from 'path';
import test from 'ava';
import execa from 'execa';
import stream from 'string-to-stream';

const here = path.join.bind(null, __dirname);

const SIMPLE = here('fixtures/simple');
const EXTENDS_ROOT = here('fixtures/extends-root');
const EMPTY = here('fixtures/empty');

const cli = (input = '', args = [], opts = {}) => {
	const c = execa(here('cli.js'), args, {
		capture: ['stdout'],
		cwd: opts.cwd
	});
	stream(input).pipe(c.stdin);
	return c;
};

test('should throw when called without [input]', t => {
	t.throws(cli(), /Expected a raw commit/);
});

test('should reprint input from stdin', async t => {
	const actual = await cli('foo: bar', [], {cwd: EMPTY});
	t.true(actual.stdout.includes('foo: bar'));
});

test('should produce no success output with --quiet flag', async t => {
	const actual = await cli('foo: bar', ['--quiet'], {cwd: EMPTY});
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
});

test('should produce no success output with -q flag', async t => {
	const actual = await cli('foo: bar', ['-q'], {cwd: EMPTY});
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
});

test('should succeed for input from stdin without rules', async t => {
	const actual = await cli('foo: bar', [], {cwd: EMPTY});
	t.is(actual.code, 0);
});

test('should fail for input from stdin with rule from rc', async t => {
	const actual = await t.throws(cli('foo: bar', [], {cwd: SIMPLE}));
	t.true(actual.stdout.includes('type must not be one of [foo]'));
	t.is(actual.code, 1);
});

test('should fail for input from stdin with rule from js', async t => {
	const actual = await t.throws(
		cli('foo: bar', ['--extends', './extended'], {cwd: EXTENDS_ROOT})
	);
	t.true(actual.stdout.includes('type must not be one of [foo]'));
	t.is(actual.code, 1);
});

test('should produce no error output with --quiet flag', async t => {
	const actual = await t.throws(cli('foo: bar', ['--quiet'], {cwd: SIMPLE}));
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
	t.is(actual.code, 1);
});

test('should produce no error output with -q flag', async t => {
	const actual = await t.throws(cli('foo: bar', ['-q'], {cwd: SIMPLE}));
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
	t.is(actual.code, 1);
});
