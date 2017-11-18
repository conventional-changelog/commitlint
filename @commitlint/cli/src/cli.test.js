import path from 'path';
import {fix, git} from '@commitlint/test';
import test from 'ava';
import execa from 'execa';
import {merge} from 'lodash';
import * as sander from 'sander';
import stream from 'string-to-stream';

const bin = path.join(__dirname, './cli.js');

const cli = (args, options) => {
	return (input = '') => {
		const c = execa(bin, args, {
			capture: ['stdout'],
			cwd: options.cwd,
			env: options.env
		});
		stream(input).pipe(c.stdin);
		return c.catch(err => err);
	};
};

test('should throw when called without [input]', async t => {
	const cwd = await git.bootstrap('fixtures/empty');
	const actual = await cli([], {cwd})();
	t.is(actual.code, 1);
});

test('should reprint input from stdin', async t => {
	const cwd = await git.bootstrap('fixtures/empty');
	const actual = await cli([], {cwd})('foo: bar');
	t.true(actual.stdout.includes('foo: bar'));
});

test('should produce no success output with --quiet flag', async t => {
	const cwd = await git.bootstrap('fixtures/empty');
	const actual = await cli(['--quiet'], {cwd})('foo: bar');
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
});

test('should produce no success output with -q flag', async t => {
	const cwd = await git.bootstrap('fixtures/empty');
	const actual = await cli(['-q'], {cwd})('foo: bar');
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
});

test('should succeed for input from stdin without rules', async t => {
	const cwd = await git.bootstrap('fixtures/empty');
	const actual = await cli([], {cwd})('foo: bar');
	t.is(actual.code, 0);
});

test('should fail for input from stdin with rule from rc', async t => {
	const cwd = await git.bootstrap('fixtures/simple');
	const actual = await cli([], {cwd})('foo: bar');
	t.true(actual.stdout.includes('type must not be one of [foo]'));
	t.is(actual.code, 1);
});

test('should fail for input from stdin with rule from js', async t => {
	const cwd = await git.bootstrap('fixtures/extends-root');
	const actual = await cli(['--extends', './extended'], {cwd})('foo: bar');
	t.true(actual.stdout.includes('type must not be one of [foo]'));
	t.is(actual.code, 1);
});

test('should produce no error output with --quiet flag', async t => {
	const cwd = await git.bootstrap('fixtures/simple');
	const actual = await cli(['--quiet'], {cwd})('foo: bar');
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
	t.is(actual.code, 1);
});

test('should produce no error output with -q flag', async t => {
	const cwd = await git.bootstrap('fixtures/simple');
	const actual = await cli(['-q'], {cwd})('foo: bar');
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
	t.is(actual.code, 1);
});

test('should work with husky commitmsg hook and git commit', async () => {
	const cwd = await git.bootstrap('fixtures/husky/integration');
	await writePkg({scripts: {commitmsg: `${bin} -e`}}, {cwd});

	await execa('npm', ['install'], {cwd});
	await execa('git', ['add', 'package.json'], {cwd});
	await execa('git', ['commit', '-m', '"test: this should work"'], {cwd});
});

test('should work with husky commitmsg hook in sub packages', async () => {
	const upper = await git.bootstrap('fixtures/husky');
	const cwd = path.join(upper, 'integration');
	await writePkg({scripts: {commitmsg: `${bin} -e`}}, {cwd: upper});

	await execa('npm', ['install'], {cwd});
	await execa('git', ['add', 'package.json'], {cwd});
	await execa('git', ['commit', '-m', '"test: this should work"'], {cwd});
});

test('should pick up parser preset and fail accordingly', async t => {
	const cwd = await git.bootstrap('fixtures/parser-preset');
	const actual = await cli(['--parser-preset', './parser-preset'], {cwd})(
		'type(scope): subject'
	);
	t.is(actual.code, 1);
	t.true(actual.stdout.includes('message may not be empty [subject-empty]'));
});

test('should pick up parser preset and succeed accordingly', async t => {
	const cwd = await git.bootstrap('fixtures/parser-preset');
	const actual = await cli(['--parser-preset', './parser-preset'], {cwd})(
		'----type(scope): subject'
	);
	t.is(actual.code, 0);
});

test('should pick up config from outside git repo and fail accordingly', async t => {
	const outer = await fix.bootstrap('fixtures/outer-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const actual = await cli([], {cwd})('inner: bar');
	t.is(actual.code, 1);
});

test('should pick up config from outside git repo and succeed accordingly', async t => {
	const outer = await fix.bootstrap('fixtures/outer-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const actual = await cli([], {cwd})('outer: bar');
	t.is(actual.code, 0);
});

test('should pick up config from inside git repo with precedence and succeed accordingly', async t => {
	const outer = await fix.bootstrap('fixtures/inner-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const actual = await cli([], {cwd})('inner: bar');
	t.is(actual.code, 0);
});

test('should pick up config from inside git repo with precedence and fail accordingly', async t => {
	const outer = await fix.bootstrap('fixtures/inner-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const actual = await cli([], {cwd})('outer: bar');
	t.is(actual.code, 1);
});

async function writePkg(payload, options) {
	const pkgPath = path.join(options.cwd, 'package.json');
	const pkg = JSON.parse(await sander.readFile(pkgPath));
	const result = merge(pkg, payload);
	await sander.writeFile(pkgPath, JSON.stringify(result, null, '  '));
}
