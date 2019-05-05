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
	const cwd = await git.bootstrap('fixtures/default');
	const actual = await cli([], {cwd})();
	t.is(actual.code, 1);
});

test('should reprint input from stdin', async t => {
	const cwd = await git.bootstrap('fixtures/default');
	const actual = await cli([], {cwd})('foo: bar');
	t.true(actual.stdout.includes('foo: bar'));
});

test('should produce no success output with --quiet flag', async t => {
	const cwd = await git.bootstrap('fixtures/default');
	const actual = await cli(['--quiet'], {cwd})('foo: bar');
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
});

test('should produce no success output with -q flag', async t => {
	const cwd = await git.bootstrap('fixtures/default');
	const actual = await cli(['-q'], {cwd})('foo: bar');
	t.is(actual.stdout, '');
	t.is(actual.stderr, '');
});

test('should fail for input from stdin without rules', async t => {
	const cwd = await git.bootstrap('fixtures/empty');
	const actual = await cli([], {cwd})('foo: bar');
	t.is(actual.code, 1);
});

test('should succeed for input from stdin with rules', async t => {
	const cwd = await git.bootstrap('fixtures/default');
	const actual = await cli([], {cwd})('type: bar');
	t.is(actual.code, 0);
});

test('should fail for input from stdin with rule from rc', async t => {
	const cwd = await git.bootstrap('fixtures/simple');
	const actual = await cli([], {cwd})('foo: bar');
	t.true(actual.stdout.includes('type must not be one of [foo]'));
	t.is(actual.code, 1);
});

test('should work with --config option', async t => {
	const file = 'config/commitlint.config.js';
	const cwd = await git.bootstrap('fixtures/specify-config-file');
	const actual = await cli(['--config', file], {cwd})('foo: bar');
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
	await writePkg({scripts: {commitmsg: `'${bin}' -e`}}, {cwd});

	await execa('npm', ['install'], {cwd});
	await execa('git', ['add', 'package.json'], {cwd});
	await execa('git', ['commit', '-m', '"test: this should work"'], {cwd});
});

test('should work with husky commitmsg hook in sub packages', async () => {
	const upper = await git.bootstrap('fixtures/husky');
	const cwd = path.join(upper, 'integration');
	await writePkg({scripts: {commitmsg: `'${bin}' -e`}}, {cwd: upper});

	await execa('npm', ['install'], {cwd});
	await execa('git', ['add', 'package.json'], {cwd});
	await execa('git', ['commit', '-m', '"test: this should work"'], {cwd});
});

test('should work with husky via commitlint -e $GIT_PARAMS', async () => {
	const cwd = await git.bootstrap('fixtures/husky/integration');
	await writePkg({scripts: {commitmsg: `'${bin}' -e $GIT_PARAMS`}}, {cwd});

	await execa('npm', ['install'], {cwd});
	await execa('git', ['add', 'package.json'], {cwd});
	await execa('git', ['commit', '-m', '"test: this should work"'], {cwd});
});

test('should work with husky via commitlint -e %GIT_PARAMS%', async () => {
	const cwd = await git.bootstrap('fixtures/husky/integration');
	await writePkg({scripts: {commitmsg: `'${bin}' -e %GIT_PARAMS%`}}, {cwd});

	await execa('npm', ['install'], {cwd});
	await execa('git', ['add', 'package.json'], {cwd});
	await execa('git', ['commit', '-m', '"test: this should work"'], {cwd});
});

test('should work with husky via commitlint -e $HUSKY_GIT_PARAMS', async () => {
	const cwd = await git.bootstrap('fixtures/husky/integration');
	await writePkg(
		{scripts: {commitmsg: `'${bin}' -e $HUSKY_GIT_PARAMS`}},
		{cwd}
	);

	await execa('npm', ['install'], {cwd});
	await execa('git', ['add', 'package.json'], {cwd});
	await execa('git', ['commit', '-m', '"test: this should work"'], {cwd});
});

test('should work with husky via commitlint -e %HUSKY_GIT_PARAMS%', async () => {
	const cwd = await git.bootstrap('fixtures/husky/integration');
	await writePkg(
		{scripts: {commitmsg: `'${bin}' -e %HUSKY_GIT_PARAMS%`}},
		{cwd}
	);

	await execa('npm', ['install'], {cwd});
	await execa('git', ['add', 'package.json'], {cwd});
	await execa('git', ['commit', '-m', '"test: this should work"'], {cwd});
});

test('should allow reading of environment variables for edit file, succeeding if valid', async t => {
	const cwd = await git.bootstrap('fixtures/simple');
	await sander.writeFile(cwd, 'commit-msg-file', 'foo');
	const actual = await cli(['--env', 'variable'], {
		cwd,
		env: {variable: 'commit-msg-file'}
	})();
	t.is(actual.code, 0);
});

test('should allow reading of environment variables for edit file, failing if invalid', async t => {
	const cwd = await git.bootstrap('fixtures/simple');
	await sander.writeFile(
		cwd,
		'commit-msg-file',
		'foo: bar\n\nFoo bar bizz buzz.\n\nCloses #123.'
	);
	const actual = await cli(['--env', 'variable'], {
		cwd,
		env: {variable: 'commit-msg-file'}
	})();
	t.is(actual.code, 1);
});

test('should pick up parser preset and fail accordingly', async t => {
	const cwd = await git.bootstrap('fixtures/parser-preset');
	const actual = await cli(['--parser-preset', './parser-preset'], {cwd})(
		'type(scope): subject'
	);
	t.is(actual.code, 1);
	t.true(actual.stdout.includes('may not be empty'));
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

test('should handle --amend with signoff', async () => {
	const cwd = await git.bootstrap('fixtures/signoff');
	await writePkg({scripts: {commitmsg: `'${bin}' -e`}}, {cwd});

	await execa('npm', ['install'], {cwd});
	await execa('git', ['add', 'package.json'], {cwd});
	await execa(
		'git',
		['commit', '-m', '"test: this should work"', '--signoff'],
		{cwd}
	);
	await execa('git', ['commit', '--amend', '--no-edit'], {cwd});
});

test('should handle linting with issue prefixes', async t => {
	const cwd = await git.bootstrap('fixtures/issue-prefixes');
	const actual = await cli([], {cwd})('foobar REF-1');
	t.is(actual.code, 0);
});

test('should print full commit message when input from stdin fails', async t => {
	const cwd = await git.bootstrap('fixtures/simple');
	const input = 'foo: bar\n\nFoo bar bizz buzz.\n\nCloses #123.';
	const actual = await cli([], {cwd})(input);

	t.true(actual.stdout.includes(input));
	t.is(actual.code, 1);
});

test('should not print full commit message when input succeeds', async t => {
	const cwd = await git.bootstrap('fixtures/default');
	const message = 'type: bar\n\nFoo bar bizz buzz.\n\nCloses #123.';
	const actual = await cli([], {cwd})(message);

	t.false(actual.stdout.includes(message));
	t.true(actual.stdout.includes(message.split('\n')[0]));
	t.is(actual.code, 0);
});

test('should fail for invalid formatters from configuration', async t => {
	const cwd = await git.bootstrap('fixtures/custom-formatter');
	const actual = await cli([], {cwd})('foo: bar');
	t.true(
		actual.stderr.includes(
			`Using format custom-formatter, but cannot find the module`
		)
	);
	t.is(actual.stdout, '');
	t.is(actual.code, 1);
});

test('should fail for invalid formatters from flags', async t => {
	const cwd = await git.bootstrap('fixtures/custom-formatter');
	const actual = await cli(['--format', 'through-flag'], {cwd})('foo: bar');
	t.true(
		actual.stderr.includes(
			`Using format through-flag, but cannot find the module`
		)
	);
	t.is(actual.stdout, '');
	t.is(actual.code, 1);
});

test('should work with absolute formatter path', async t => {
	const formatterPath = path.resolve(
		__dirname,
		'../fixtures/custom-formatter/formatters/custom.js'
	);
	const cwd = await git.bootstrap('fixtures/custom-formatter');
	const actual = await cli(['--format', formatterPath], {cwd})(
		'test: this should work'
	);

	t.true(actual.stdout.includes('custom-formatter-ok'));
	t.is(actual.code, 0);
});

test('should work with relative formatter path', async t => {
	const cwd = path.resolve(
		await git.bootstrap('fixtures/custom-formatter'),
		'./formatters'
	);
	const actual = await cli(['--format', './custom.js'], {cwd})(
		'test: this should work'
	);

	t.true(actual.stdout.includes('custom-formatter-ok'));
	t.is(actual.code, 0);
});

async function writePkg(payload, options) {
	const pkgPath = path.join(options.cwd, 'package.json');
	const pkg = JSON.parse(await sander.readFile(pkgPath));
	const result = merge(pkg, payload);
	await sander.writeFile(pkgPath, JSON.stringify(result, null, '  '));
}
