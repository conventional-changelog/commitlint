import {fix, git} from '@commitlint/test';
import execa from 'execa';
import fs from 'fs-extra';
import merge from 'lodash.merge';
import path from 'path';

const bin = require.resolve('../cli.js');

interface TestOptions {
	cwd: string;
	env?: Record<string, string>;
}

const cli = (args: string[], options: TestOptions) => {
	return (input = '') => {
		return execa(bin, args, {
			cwd: options.cwd,
			env: options.env,
			input: input,
			reject: false,
		});
	};
};

const gitBootstrap = (fixture: string) => git.bootstrap(fixture, __dirname);
const fixBootstrap = (fixture: string) => fix.bootstrap(fixture, __dirname);

test('should throw when called without [input]', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli([], {cwd})();
	expect(actual.exitCode).toBe(1);
});

test('should reprint input from stdin', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli([], {cwd})('foo: bar');
	expect(actual.stdout).toContain('foo: bar');
});

test('should produce success output with --verbose flag', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli(['--verbose'], {cwd})('type: bar');
	expect(actual.stdout).toContain('0 problems, 0 warnings');
	expect(actual.stderr).toEqual('');
});

test('should produce no output with --quiet flag', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli(['--quiet'], {cwd})('foo: bar');
	expect(actual.stdout).toEqual('');
	expect(actual.stderr).toEqual('');
});

test('should produce no output with -q flag', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli(['-q'], {cwd})('foo: bar');
	expect(actual.stdout).toEqual('');
	expect(actual.stderr).toEqual('');
});

test('should produce help for empty config', async () => {
	const cwd = await gitBootstrap('fixtures/empty');
	const actual = await cli([], {cwd})('foo: bar');
	expect(actual.stdout).toContain('Please add rules');
	expect(actual.exitCode).toBe(1);
});

test('should produce help for problems', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli([], {cwd})('foo: bar');
	expect(actual.stdout).toContain(
		'Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint'
	);
	expect(actual.exitCode).toBe(1);
});

test('should produce help for problems with correct helpurl', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli(
		['-H https://github.com/conventional-changelog/commitlint/#testhelpurl'],
		{cwd}
	)('foo: bar');
	expect(actual.stdout).toContain(
		'Get help: https://github.com/conventional-changelog/commitlint/#testhelpurl'
	);
	expect(actual.exitCode).toBe(1);
});

test('should fail for input from stdin without rules', async () => {
	const cwd = await gitBootstrap('fixtures/empty');
	const actual = await cli([], {cwd})('foo: bar');
	expect(actual.exitCode).toBe(1);
});

test('should succeed for input from stdin with rules', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli([], {cwd})('type: bar');
	expect(actual.exitCode).toBe(0);
});

test('should fail for input from stdin with rule from rc', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	const actual = await cli([], {cwd})('foo: bar');
	expect(actual.stdout).toContain('type must not be one of [foo]');
	expect(actual.exitCode).toBe(1);
});

test('should work with --config option', async () => {
	const file = 'config/commitlint.config.js';
	const cwd = await gitBootstrap('fixtures/specify-config-file');
	const actual = await cli(['--config', file], {cwd})('foo: bar');
	expect(actual.stdout).toContain('type must not be one of [foo]');
	expect(actual.exitCode).toBe(1);
});

test('should fail for input from stdin with rule from js', async () => {
	const cwd = await gitBootstrap('fixtures/extends-root');
	const actual = await cli(['--extends', './extended'], {cwd})('foo: bar');
	expect(actual.stdout).toContain('type must not be one of [foo]');
	expect(actual.exitCode).toBe(1);
});

test('should output help URL defined in config file', async () => {
	const cwd = await gitBootstrap('fixtures/help-url');
	const actual = await cli([], {cwd})('foo: bar');
	expect(actual.stdout).toContain('Get help: https://www.example.com/foo');
	expect(actual.exitCode).toBe(1);
});

test('should produce no error output with --quiet flag', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	const actual = await cli(['--quiet'], {cwd})('foo: bar');
	expect(actual.stdout).toEqual('');
	expect(actual.stderr).toEqual('');
	expect(actual.exitCode).toBe(1);
});

test('should produce no error output with -q flag', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	const actual = await cli(['-q'], {cwd})('foo: bar');
	expect(actual.stdout).toEqual('');
	expect(actual.stderr).toEqual('');
	expect(actual.exitCode).toBe(1);
});

test('should work with husky commitmsg hook and git commit', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg({husky: {hooks: {'commit-msg': `'${bin}' -e`}}}, {cwd});

	// await execa('npm', ['install'], {cwd}); // npm install is failing on windows machines
	await execa('git', ['add', 'package.json'], {cwd});
	const commit = await execa(
		'git',
		['commit', '-m', '"test: this should work"'],
		{cwd}
	);

	expect(commit).toBeTruthy();
});

test('should work with husky commitmsg hook in sub packages', async () => {
	const upper = await gitBootstrap('fixtures/husky');
	const cwd = path.join(upper, 'integration');
	await writePkg({husky: {hooks: {'commit-msg': `'${bin}' -e`}}}, {cwd: upper});

	// await execa('npm', ['install'], {cwd}); // npm install is failing on windows machines
	await execa('git', ['add', 'package.json'], {cwd});
	const commit = await execa(
		'git',
		['commit', '-m', '"test: this should work"'],
		{cwd}
	);
	expect(commit).toBeTruthy();
});

test('should work with husky via commitlint -e $GIT_PARAMS', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg(
		{husky: {hooks: {'commit-msg': `'${bin}' -e $GIT_PARAMS`}}},
		{cwd}
	);

	// await execa('npm', ['install'], {cwd}); // npm install is failing on windows machines
	await execa('git', ['add', 'package.json'], {cwd});
	const commit = await execa(
		'git',
		['commit', '-m', '"test: this should work"'],
		{cwd}
	);
	expect(commit).toBeTruthy();
});

test('should work with husky via commitlint -e %GIT_PARAMS%', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg(
		{husky: {hooks: {'commit-msg': `'${bin}' -e %GIT_PARAMS%`}}},
		{cwd}
	);

	// await execa('npm', ['install'], {cwd}); // npm install is failing on windows machines
	await execa('git', ['add', 'package.json'], {cwd});
	const commit = await execa(
		'git',
		['commit', '-m', '"test: this should work"'],
		{cwd}
	);
	expect(commit).toBeTruthy();
});

test('should work with husky via commitlint -e $HUSKY_GIT_PARAMS', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg(
		{husky: {hooks: {'commit-msg': `'${bin}' -e $HUSKY_GIT_PARAMS`}}},
		{cwd}
	);

	// await execa('npm', ['install'], {cwd}); // npm install is failing on windows machines
	await execa('git', ['add', 'package.json'], {cwd});
	const commit = await execa(
		'git',
		['commit', '-m', '"test: this should work"'],
		{cwd}
	);
	expect(commit).toBeTruthy();
});

test('should work with husky via commitlint -e %HUSKY_GIT_PARAMS%', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg(
		{husky: {hooks: {'commit-msg': `'${bin}' -e %HUSKY_GIT_PARAMS%`}}},
		{cwd}
	);

	// await execa('npm', ['install'], {cwd}); // npm install is failing on windows machines
	await execa('git', ['add', 'package.json'], {cwd});
	const commit = await execa(
		'git',
		['commit', '-m', '"test: this should work"'],
		{cwd}
	);
	expect(commit).toBeTruthy();
});

test('should allow reading of environment variables for edit file, succeeding if valid', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	await fs.writeFile(path.join(cwd, 'commit-msg-file'), 'foo');
	const actual = await cli(['--env', 'variable'], {
		cwd,
		env: {variable: 'commit-msg-file'},
	})();
	expect(actual.exitCode).toBe(0);
});

test('should allow reading of environment variables for edit file, failing if invalid', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	await fs.writeFile(
		path.join(cwd, 'commit-msg-file'),
		'foo: bar\n\nFoo bar bizz buzz.\n\nCloses #123.'
	);
	const actual = await cli(['--env', 'variable'], {
		cwd,
		env: {variable: 'commit-msg-file'},
	})();
	expect(actual.exitCode).toBe(1);
});

test('should pick up parser preset and fail accordingly', async () => {
	const cwd = await gitBootstrap('fixtures/parser-preset');
	const actual = await cli(['--parser-preset', './parser-preset'], {cwd})(
		'type(scope): subject'
	);
	expect(actual.exitCode).toBe(1);
	expect(actual.stdout).toContain('may not be empty');
});

test('should pick up parser preset and succeed accordingly', async () => {
	const cwd = await gitBootstrap('fixtures/parser-preset');
	const actual = await cli(['--parser-preset', './parser-preset'], {cwd})(
		'----type(scope): subject'
	);
	expect(actual.exitCode).toBe(0);
});

test('should pick up config from outside git repo and fail accordingly', async () => {
	const outer = await fixBootstrap('fixtures/outer-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const actual = await cli([], {cwd})('inner: bar');
	expect(actual.exitCode).toBe(1);
});

test('should pick up config from outside git repo and succeed accordingly', async () => {
	const outer = await fixBootstrap('fixtures/outer-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const actual = await cli([], {cwd})('outer: bar');
	expect(actual.exitCode).toBe(0);
});

test('should pick up config from inside git repo with precedence and succeed accordingly', async () => {
	const outer = await fixBootstrap('fixtures/inner-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const actual = await cli([], {cwd})('inner: bar');
	expect(actual.exitCode).toBe(0);
});

test('should pick up config from inside git repo with precedence and fail accordingly', async () => {
	const outer = await fixBootstrap('fixtures/inner-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const actual = await cli([], {cwd})('outer: bar');
	expect(actual.exitCode).toBe(1);
});

test('should handle --amend with signoff', async () => {
	const cwd = await gitBootstrap('fixtures/signoff');
	await writePkg({husky: {hooks: {'commit-msg': `'${bin}' -e`}}}, {cwd});

	// await execa('npm', ['install'], {cwd}); // npm install is failing on windows machines
	await execa('git', ['add', 'package.json'], {cwd});
	await execa(
		'git',
		['commit', '-m', '"test: this should work"', '--signoff'],
		{cwd}
	);
	const commit = await execa('git', ['commit', '--amend', '--no-edit'], {cwd});

	expect(commit).toBeTruthy();
}, 10000);

test('it uses parserOpts.commentChar when not using edit mode', async () => {
	const cwd = await gitBootstrap('fixtures/comment-char');
	const input = 'header: foo\n$body\n';

	const actual = await cli([], {cwd})(input);
	expect(actual.stdout).toContain('[body-empty]');
	expect(actual.exitCode).toBe(1);
});

test("it doesn't use parserOpts.commentChar when using edit mode", async () => {
	const cwd = await gitBootstrap('fixtures/comment-char');
	await fs.writeFile(
		path.join(cwd, '.git', 'COMMIT_EDITMSG'),
		'header: foo\n\n$body\n'
	);

	const actual = await cli(['--edit', '.git/COMMIT_EDITMSG'], {cwd})();
	expect(actual.stdout).not.toContain('[body-empty]');
	expect(actual.exitCode).toBe(0);
});

test('it uses core.commentChar git config when using edit mode', async () => {
	const cwd = await gitBootstrap('fixtures/comment-char');
	await execa('git', ['config', '--local', 'core.commentChar', '$'], {cwd});
	await fs.writeFile(
		path.join(cwd, '.git', 'COMMIT_EDITMSG'),
		'header: foo\n\n$body\n'
	);

	const actual = await cli(['--edit', '.git/COMMIT_EDITMSG'], {cwd})();
	expect(actual.stdout).toContain('[body-empty]');
	expect(actual.exitCode).toBe(1);
});

test('it falls back to # for core.commentChar when using edit mode', async () => {
	const cwd = await gitBootstrap('fixtures/comment-char');
	await fs.writeFile(
		path.join(cwd, '.git', 'COMMIT_EDITMSG'),
		'header: foo\n\n#body\n'
	);

	const actual = await cli(['--edit', '.git/COMMIT_EDITMSG'], {cwd})();
	expect(actual.stdout).toContain('[body-empty]');
	expect(actual.stderr).toEqual('');
	expect(actual.exitCode).toBe(1);
});

test('should handle linting with issue prefixes', async () => {
	const cwd = await gitBootstrap('fixtures/issue-prefixes');
	const actual = await cli([], {cwd})('foobar REF-1');
	expect(actual.exitCode).toBe(0);
}, 10000);

test('should print full commit message when input from stdin fails', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	const input = 'foo: bar\n\nFoo bar bizz buzz.\n\nCloses #123.';
	// output text in plain text so we can compare it
	const actual = await cli(['--color=false'], {cwd})(input);

	expect(actual.stdout).toContain(input);
	expect(actual.exitCode).toBe(1);
});

test('should not print commit message fully or partially when input succeeds', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const message = 'type: bar\n\nFoo bar bizz buzz.\n\nCloses #123.';
	// output text in plain text so we can compare it
	const actual = await cli(['--color=false'], {cwd})(message);

	expect(actual.stdout).not.toContain(message);
	expect(actual.stdout).not.toContain(message.split('\n')[0]);
	expect(actual.exitCode).toBe(0);
});

test('should fail for invalid formatters from configuration', async () => {
	const cwd = await gitBootstrap('fixtures/custom-formatter');
	const actual = await cli([], {cwd})('foo: bar');

	expect(actual.stderr).toContain(
		'Using format custom-formatter, but cannot find the module'
	);
	expect(actual.stdout).toEqual('');
	expect(actual.exitCode).toBe(1);
});

test('should skip linting if message matches ignores config', async () => {
	const cwd = await gitBootstrap('fixtures/ignores');
	const actual = await cli([], {cwd})('WIP');
	expect(actual.exitCode).toBe(0);
});

test('should not skip linting if message does not match ignores config', async () => {
	const cwd = await gitBootstrap('fixtures/ignores');
	const actual = await cli([], {cwd})('foo');
	expect(actual.exitCode).toBe(1);
});

test('should not skip linting if defaultIgnores is false', async () => {
	const cwd = await gitBootstrap('fixtures/default-ignores-false');
	const actual = await cli([], {cwd})('fixup! foo: bar');
	expect(actual.exitCode).toBe(1);
});

test('should skip linting if defaultIgnores is true', async () => {
	const cwd = await gitBootstrap('fixtures/default-ignores-true');
	const actual = await cli([], {cwd})('fixup! foo: bar');
	expect(actual.exitCode).toBe(0);
});

test('should skip linting if defaultIgnores is unset', async () => {
	const cwd = await gitBootstrap('fixtures/default-ignores-unset');
	const actual = await cli([], {cwd})('fixup! foo: bar');
	expect(actual.exitCode).toBe(0);
});

test('should fail for invalid formatters from flags', async () => {
	const cwd = await gitBootstrap('fixtures/custom-formatter');
	const actual = await cli(['--format', 'through-flag'], {cwd})('foo: bar');

	expect(actual.stderr).toContain(
		'Using format through-flag, but cannot find the module'
	);
	expect(actual.stdout).toEqual('');
	expect(actual.exitCode).toBe(1);
});

test('should work with absolute formatter path', async () => {
	const formatterPath = path.resolve(
		__dirname,
		'../fixtures/custom-formatter/formatters/custom.js'
	);
	const cwd = await gitBootstrap('fixtures/custom-formatter');
	const actual = await cli(['--format', formatterPath], {cwd})(
		'test: this should work'
	);

	expect(actual.stdout).toContain('custom-formatter-ok');
	expect(actual.exitCode).toBe(0);
});

test('should work with relative formatter path', async () => {
	const cwd = path.resolve(
		await gitBootstrap('fixtures/custom-formatter'),
		'./formatters'
	);
	const actual = await cli(['--format', './custom.js'], {cwd})(
		'test: this should work'
	);

	expect(actual.stdout).toContain('custom-formatter-ok');
	expect(actual.exitCode).toBe(0);
});

test('strict: should exit with 3 on error', async () => {
	const cwd = await gitBootstrap('fixtures/warning');
	const actual = await cli(['--strict'], {cwd})('foo: abcdef');
	expect(actual.exitCode).toBe(3);
});

test('strict: should exit with 2 on warning', async () => {
	const cwd = await gitBootstrap('fixtures/warning');
	const actual = await cli(['--strict'], {cwd})('feat: abcdef');
	expect(actual.exitCode).toBe(2);
});

test('strict: should exit with 0 on success', async () => {
	const cwd = await gitBootstrap('fixtures/warning');
	const actual = await cli(['--strict'], {cwd})('feat: abc');
	expect(actual.exitCode).toBe(0);
});

test('should print help', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli(['--help'], {cwd})();
	const version = require('../package.json').version;
	const stdout = actual.stdout.replace(`@${version}`, '@dev');
	expect(stdout).toMatchInlineSnapshot(`
		"@commitlint/cli@dev - Lint your commit messages

		[input] reads from stdin if --edit, --env, --from and --to are omitted

		Options:
		  -c, --color          toggle colored output           [boolean] [default: true]
		  -g, --config         path to the config file                          [string]
		      --print-config   print resolved config          [boolean] [default: false]
		  -d, --cwd            directory to execute in
		                                         [string] [default: (Working Directory)]
		  -e, --edit           read last commit message from the specified file or
		                       fallbacks to ./.git/COMMIT_EDITMSG               [string]
		  -E, --env            check message in the file at path given by environment
		                       variable value                                   [string]
		  -x, --extends        array of shareable configurations to extend       [array]
		  -H, --help-url       help url in error message                        [string]
		  -f, --from           lower end of the commit range to lint; applies if
		                       edit=false                                       [string]
		      --git-log-args   additional git log arguments as space separated string,
		                       example '--first-parent --cherry-pick'           [string]
		  -o, --format         output format of the results                     [string]
		  -p, --parser-preset  configuration preset to use for
		                       conventional-commits-parser                      [string]
		  -q, --quiet          toggle console output          [boolean] [default: false]
		  -t, --to             upper end of the commit range to lint; applies if
		                       edit=false                                       [string]
		  -V, --verbose        enable verbose output for reports without problems
		                                                                       [boolean]
		  -s, --strict         enable strict mode; result code 2 for warnings, 3 for
		                       errors                                          [boolean]
		  -v, --version        display version information                     [boolean]
		  -h, --help           Show help                                       [boolean]"
	`);
});

test('should print version', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli(['--version'], {cwd})();
	expect(actual.stdout).toMatch('@commitlint/cli@');
});

test('should print config', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const actual = await cli(['--print-config', '--no-color'], {cwd})();
	const stdout = actual.stdout
		.replace(/^{[^\n]/g, '{\n  ')
		.replace(/[^\n]}$/g, '\n}')
		.replace(/(helpUrl:)\n[ ]+/, '$1 ');
	expect(stdout).toMatchInlineSnapshot(`
		"{
		  extends: [],
		  formatter: '@commitlint/format',
		  parserPreset: undefined,
		  ignores: undefined,
		  defaultIgnores: undefined,
		  plugins: {},
		  rules: { 'type-enum': [ 2, 'never', [ 'foo' ] ] },
		  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
		  prompt: {}
		}"
	`);
});

async function writePkg(payload: unknown, options: TestOptions) {
	const pkgPath = path.join(options.cwd, 'package.json');
	const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
	const result = merge(pkg, payload);
	await fs.writeFile(pkgPath, JSON.stringify(result, null, '  '));
}
