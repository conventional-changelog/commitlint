import {describe, test, expect} from 'vitest';
import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath} from 'url';
import {fix, git} from '@commitlint/test';
import fs from 'fs-extra';
import merge from 'lodash.merge';
import {x} from 'tinyexec';
import {ExitCode} from './cli-error.js';

const require = createRequire(import.meta.url);

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..');

const bin = require.resolve('../cli.js');

interface TestOptions {
	cwd: string;
	env?: Record<string, string>;
}

const cli = (args: string[], options: TestOptions) => {
	return (input = '') => {
		const result = x(bin, args, {
			nodeOptions: {
				cwd: options.cwd,
				env: options.env,
			},
		});

		result.process?.stdin?.write(input);
		result.process?.stdin?.end();

		return result;
	};
};

const gitBootstrap = (fixture: string) => git.bootstrap(fixture, __dirname);
const fixBootstrap = (fixture: string) => fix.bootstrap(fixture, __dirname);

test('should throw when called without [input]', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli([], {cwd})();
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should reprint input from stdin', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli([], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toContain('foo: bar');
});

test('should produce success output with --verbose flag', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli(['--verbose'], {cwd})('type: bar');
	const output = await result;
	expect(output.stdout.trim()).toContain('0 problems, 0 warnings');
	expect(output.stderr).toEqual('');
});

test('should produce last commit and success output with --verbose flag', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	await x('git', ['add', 'commitlint.config.js'], {nodeOptions: {cwd}});
	await x('git', ['commit', '-m', '"test: this should work"'], {
		nodeOptions: {cwd},
	});
	const result = cli(['--last', '--verbose'], {cwd})();
	const output = await result;
	expect(output.stdout.trim()).toContain('0 problems, 0 warnings');
	expect(output.stdout.trim()).toContain('test: this should work');
	expect(output.stderr).toEqual('');
});

test('regression test for running with --last flag', async () => {
	const cwd = await gitBootstrap('fixtures/last-flag-regression');
	await x('git', ['add', 'commitlint.config.js'], {nodeOptions: {cwd}});
	await x('git', ['commit', '-m', '"test: this should work"'], {
		nodeOptions: {cwd},
	});
	const result = cli(['--last', '--verbose'], {cwd})();
	const output = await result;
	expect(output.stdout.trim()).toContain('0 problems, 0 warnings');
	expect(output.stdout.trim()).toContain('test: this should work');
	expect(output.stderr).toEqual('');
});

test('should produce no output with --quiet flag', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli(['--quiet'], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toEqual('');
	expect(output.stderr).toEqual('');
});

test('should produce no output with -q flag', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli(['-q'], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toEqual('');
	expect(output.stderr).toEqual('');
});

test('should produce help for empty config', async () => {
	const cwd = await gitBootstrap('fixtures/empty');
	const result = cli([], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toContain('Please add rules');
	expect(result.exitCode).toBe(ExitCode.CommitlintInvalidArgument);
});

test('should produce help for problems', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli([], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toContain(
		'Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint'
	);
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should produce help for problems with correct helpurl', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli(
		['-H https://github.com/conventional-changelog/commitlint/#testhelpurl'],
		{cwd}
	)('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toContain(
		'Get help: https://github.com/conventional-changelog/commitlint/#testhelpurl'
	);
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should fail for input from stdin without rules', async () => {
	const cwd = await gitBootstrap('fixtures/empty');
	const result = cli([], {cwd})('foo: bar');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintInvalidArgument);
});

test('should succeed for input from stdin with rules', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli([], {cwd})('type: bar');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should fail for input from stdin with rule from rc', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	const result = cli([], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toContain('type must not be one of [foo]');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should work with --config option', async () => {
	const file = 'config/commitlint.config.js';
	const cwd = await gitBootstrap('fixtures/specify-config-file');
	const result = cli(['--config', file], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toContain('type must not be one of [foo]');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should fail for input from stdin with rule from js', async () => {
	const cwd = await gitBootstrap('fixtures/extends-root');
	const result = cli(['--extends', './extended'], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toContain('type must not be one of [foo]');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should output help URL defined in config file', async () => {
	const cwd = await gitBootstrap('fixtures/help-url');
	const result = cli([], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toContain(
		'Get help: https://www.example.com/foo'
	);
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should produce no error output with --quiet flag', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	const result = cli(['--quiet'], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toEqual('');
	expect(output.stderr).toEqual('');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should produce no error output with -q flag', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	const result = cli(['-q'], {cwd})('foo: bar');
	const output = await result;
	expect(output.stdout.trim()).toEqual('');
	expect(output.stderr).toEqual('');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should work with husky commitmsg hook and git commit', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg({husky: {hooks: {'commit-msg': `'${bin}' -e`}}}, {cwd});

	// await x('npm', ['install'], { nodeOptions: {cwd}}); // npm install is failing on windows machines
	await x('git', ['add', 'package.json'], {nodeOptions: {cwd}});
	const commit = await x('git', ['commit', '-m', '"test: this should work"'], {
		nodeOptions: {cwd},
	});

	expect(commit).toBeTruthy();
});

test('should work with husky commitmsg hook in sub packages', async () => {
	const upper = await gitBootstrap('fixtures/husky');
	const cwd = path.join(upper, 'integration');
	await writePkg({husky: {hooks: {'commit-msg': `'${bin}' -e`}}}, {cwd: upper});

	// await x('npm', ['install'], { nodeOptions: {cwd}}); // npm install is failing on windows machines
	await x('git', ['add', 'package.json'], {nodeOptions: {cwd}});
	const commit = await x('git', ['commit', '-m', '"test: this should work"'], {
		nodeOptions: {cwd},
	});
	expect(commit).toBeTruthy();
});

test('should work with husky via commitlint -e $GIT_PARAMS', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg(
		{husky: {hooks: {'commit-msg': `'${bin}' -e $GIT_PARAMS`}}},
		{cwd}
	);

	// await x('npm', ['install'], { nodeOptions: {cwd}}); // npm install is failing on windows machines
	await x('git', ['add', 'package.json'], {nodeOptions: {cwd}});
	const commit = await x('git', ['commit', '-m', '"test: this should work"'], {
		nodeOptions: {cwd},
	});
	expect(commit).toBeTruthy();
});

test('should work with husky via commitlint -e %GIT_PARAMS%', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg(
		{husky: {hooks: {'commit-msg': `'${bin}' -e %GIT_PARAMS%`}}},
		{cwd}
	);

	// await x('npm', ['install'], { nodeOptions: {cwd}}); // npm install is failing on windows machines
	await x('git', ['add', 'package.json'], {nodeOptions: {cwd}});
	const commit = await x('git', ['commit', '-m', '"test: this should work"'], {
		nodeOptions: {cwd},
	});
	expect(commit).toBeTruthy();
});

test('should work with husky via commitlint -e $HUSKY_GIT_PARAMS', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg(
		{husky: {hooks: {'commit-msg': `'${bin}' -e $HUSKY_GIT_PARAMS`}}},
		{cwd}
	);

	// await x('npm', ['install'], { nodeOptions: {cwd}}); // npm install is failing on windows machines
	await x('git', ['add', 'package.json'], {nodeOptions: {cwd}});
	const commit = await x('git', ['commit', '-m', '"test: this should work"'], {
		nodeOptions: {cwd},
	});
	expect(commit).toBeTruthy();
});

test('should work with husky via commitlint -e %HUSKY_GIT_PARAMS%', async () => {
	const cwd = await gitBootstrap('fixtures/husky/integration');
	await writePkg(
		{husky: {hooks: {'commit-msg': `'${bin}' -e %HUSKY_GIT_PARAMS%`}}},
		{cwd}
	);

	// await x('npm', ['install'], { nodeOptions: {cwd}}); // npm install is failing on windows machines
	await x('git', ['add', 'package.json'], {nodeOptions: {cwd}});
	const commit = await x('git', ['commit', '-m', '"test: this should work"'], {
		nodeOptions: {cwd},
	});
	expect(commit).toBeTruthy();
});

test('should allow reading of environment variables for edit file, succeeding if valid', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	await fs.writeFile(path.join(cwd, 'commit-msg-file'), 'foo');
	const result = cli(['--env', 'variable'], {
		cwd,
		env: {variable: 'commit-msg-file'},
	})();
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should allow reading of environment variables for edit file, failing if invalid', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	await fs.writeFile(
		path.join(cwd, 'commit-msg-file'),
		'foo: bar\n\nFoo bar bizz buzz.\n\nCloses #123.'
	);
	const result = cli(['--env', 'variable'], {
		cwd,
		env: {variable: 'commit-msg-file'},
	})();
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should pick up parser preset and fail accordingly', async () => {
	const cwd = await gitBootstrap('fixtures/parser-preset');
	const result = cli(['--parser-preset', './parser-preset'], {cwd})(
		'type(scope): subject'
	);
	const output = await result;
	expect(output.stdout.trim()).toContain('may not be empty');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should pick up parser preset and succeed accordingly', async () => {
	const cwd = await gitBootstrap('fixtures/parser-preset');
	const result = cli(['--parser-preset', './parser-preset'], {cwd})(
		'----type(scope): subject'
	);
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should pick up config from outside git repo and fail accordingly', async () => {
	const outer = await fixBootstrap('fixtures/outer-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const result = cli([], {cwd})('inner: bar');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should pick up config from outside git repo and succeed accordingly', async () => {
	const outer = await fixBootstrap('fixtures/outer-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const result = cli([], {cwd})('outer: bar');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should pick up config from inside git repo with precedence and succeed accordingly', async () => {
	const outer = await fixBootstrap('fixtures/inner-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const result = cli([], {cwd})('inner: bar');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should pick up config from inside git repo with precedence and fail accordingly', async () => {
	const outer = await fixBootstrap('fixtures/inner-scope');
	const cwd = await git.init(path.join(outer, 'inner-scope'));

	const result = cli([], {cwd})('outer: bar');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should handle --amend with signoff', async () => {
	const cwd = await gitBootstrap('fixtures/signoff');
	await writePkg({husky: {hooks: {'commit-msg': `'${bin}' -e`}}}, {cwd});

	// await x('npm', ['install'], { nodeOptions: {cwd}}); // npm install is failing on windows machines
	await x('git', ['add', 'package.json'], {nodeOptions: {cwd}});
	await x('git', ['commit', '-m', '"test: this should work"', '--signoff'], {
		nodeOptions: {cwd},
	});
	const commit = await x('git', ['commit', '--amend', '--no-edit'], {
		nodeOptions: {cwd},
	});

	expect(commit).toBeTruthy();
}, 10000);

test('it uses parserOpts.commentChar when not using edit mode', async () => {
	const cwd = await gitBootstrap('fixtures/comment-char');
	const input = 'header: foo\n$body\n';

	const result = cli([], {cwd})(input);
	const output = await result;
	expect(output.stdout.trim()).toContain('[body-empty]');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test("it doesn't use parserOpts.commentChar when using edit mode", async () => {
	const cwd = await gitBootstrap('fixtures/comment-char');
	await fs.writeFile(
		path.join(cwd, '.git', 'COMMIT_EDITMSG'),
		'header: foo\n\n$body\n'
	);

	const result = cli(['--edit', '.git/COMMIT_EDITMSG'], {cwd})();
	const output = await result;
	expect(output.stdout.trim()).not.toContain('[body-empty]');
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('it uses core.commentChar git config when using edit mode', async () => {
	const cwd = await gitBootstrap('fixtures/comment-char');
	await x('git', ['config', '--local', 'core.commentChar', '$'], {
		nodeOptions: {cwd},
	});
	await fs.writeFile(
		path.join(cwd, '.git', 'COMMIT_EDITMSG'),
		'header: foo\n\n$body\n'
	);

	const result = cli(['--edit', '.git/COMMIT_EDITMSG'], {cwd})();
	const output = await result;
	expect(output.stdout.trim()).toContain('[body-empty]');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('it falls back to # for core.commentChar when using edit mode', async () => {
	const cwd = await gitBootstrap('fixtures/comment-char');
	await fs.writeFile(
		path.join(cwd, '.git', 'COMMIT_EDITMSG'),
		'header: foo\n\n#body\n'
	);

	const result = cli(['--edit', '.git/COMMIT_EDITMSG'], {cwd})();
	const output = await result;
	expect(output.stdout.trim()).toContain('[body-empty]');
	expect(output.stderr).toEqual('');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should handle linting with issue prefixes', async () => {
	const cwd = await gitBootstrap('fixtures/issue-prefixes');
	const result = cli([], {cwd})('foobar REF-1');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
}, 10000);

test('should print full commit message when input from stdin fails', async () => {
	const cwd = await gitBootstrap('fixtures/simple');
	const input = 'foo: bar\n\nFoo bar bizz buzz.\n\nCloses #123.';
	// output text in plain text so we can compare it
	const result = cli(['--color=false'], {cwd})(input);
	const output = await result;
	expect(output.stdout.trim()).toContain(input);
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should not print commit message fully or partially when input succeeds', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const message = 'type: bar\n\nFoo bar bizz buzz.\n\nCloses #123.';
	// output text in plain text so we can compare it
	const result = cli(['--color=false'], {cwd})(message);
	const output = await result;
	expect(output.stdout.trim()).not.toContain(message);
	expect(output.stdout.trim()).not.toContain(message.split('\n')[0]);
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should fail for invalid formatters from configuration', async () => {
	const cwd = await gitBootstrap('fixtures/custom-formatter');
	const result = cli([], {cwd})('foo: bar');
	const output = await result;
	expect(output.stderr).toContain(
		'Using format custom-formatter, but cannot find the module'
	);
	expect(output.stdout.trim()).toEqual('');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should skip linting if message matches ignores config', async () => {
	const cwd = await gitBootstrap('fixtures/ignores');
	const result = cli([], {cwd})('WIP');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should not skip linting if message does not match ignores config', async () => {
	const cwd = await gitBootstrap('fixtures/ignores');
	const result = cli([], {cwd})('foo');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should not skip linting if defaultIgnores is false', async () => {
	const cwd = await gitBootstrap('fixtures/default-ignores-false');
	const result = cli([], {cwd})('fixup! foo: bar');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should skip linting if defaultIgnores is true', async () => {
	const cwd = await gitBootstrap('fixtures/default-ignores-true');
	const result = cli([], {cwd})('fixup! foo: bar');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should skip linting if defaultIgnores is unset', async () => {
	const cwd = await gitBootstrap('fixtures/default-ignores-unset');
	const result = cli([], {cwd})('fixup! foo: bar');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should fail for invalid formatters from flags', async () => {
	const cwd = await gitBootstrap('fixtures/custom-formatter');
	const result = cli(['--format', 'through-flag'], {cwd})('foo: bar');
	const output = await result;
	expect(output.stderr).toContain(
		'Using format through-flag, but cannot find the module'
	);
	expect(output.stdout.trim()).toEqual('');
	expect(result.exitCode).toBe(ExitCode.CommitlintErrorDefault);
});

test('should work with absolute formatter path', async () => {
	const formatterPath = path.resolve(
		__dirname,
		'../fixtures/custom-formatter/formatters/custom.js'
	);
	const cwd = await gitBootstrap('fixtures/custom-formatter');
	const result = cli(['--format', formatterPath], {cwd})(
		'test: this should work'
	);
	const output = await result;
	expect(output.stdout.trim()).toContain('custom-formatter-ok');
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should work with relative formatter path', async () => {
	const cwd = path.resolve(
		await gitBootstrap('fixtures/custom-formatter'),
		'./formatters'
	);
	const result = cli(['--format', './custom.js'], {cwd})(
		'test: this should work'
	);
	const output = await result;
	expect(output.stdout.trim()).toContain('custom-formatter-ok');
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('strict: should exit with 3 on error', async () => {
	const cwd = await gitBootstrap('fixtures/warning');
	const result = cli(['--strict'], {cwd})('foo: abcdef');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitLintError);
});

test('strict: should exit with 2 on warning', async () => {
	const cwd = await gitBootstrap('fixtures/warning');
	const result = cli(['--strict'], {cwd})('feat: abcdef');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitLintWarning);
});

test('strict: should exit with 0 on success', async () => {
	const cwd = await gitBootstrap('fixtures/warning');
	const result = cli(['--strict'], {cwd})('feat: abc');
	await result;
	expect(result.exitCode).toBe(ExitCode.CommitlintDefault);
});

test('should print help', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli(['--help'], {cwd})();
	const output = await result;
	const version = require('../package.json').version;
	const stdout = output.stdout.trim().replace(`@${version}`, '@dev');
	expect(stdout).toMatchInlineSnapshot(`
		"@commitlint/cli@dev - Lint your commit messages

		[input] reads from stdin if --edit, --env, --from and --to are omitted

		Options:
		  -c, --color          toggle colored output  [boolean] [default: true]
		  -g, --config         path to the config file; result code 9 if config is missing  [string]
		      --print-config   print resolved config  [string] [choices: "", "text", "json"]
		  -d, --cwd            directory to execute in  [string] [default: (Working Directory)]
		  -e, --edit           read last commit message from the specified file or fallbacks to ./.git/COMMIT_EDITMSG  [string]
		  -E, --env            check message in the file at path given by environment variable value  [string]
		  -x, --extends        array of shareable configurations to extend  [array]
		  -H, --help-url       help url in error message  [string]
		  -f, --from           lower end of the commit range to lint; applies if edit=false  [string]
		      --from-last-tag  uses the last tag as the lower end of the commit range to lint; applies if edit=false and from is not set  [boolean]
		      --git-log-args   additional git log arguments as space separated string, example '--first-parent --cherry-pick'  [string]
		  -l, --last           just analyze the last commit; applies if edit=false  [boolean]
		  -o, --format         output format of the results  [string]
		  -p, --parser-preset  configuration preset to use for conventional-commits-parser  [string]
		  -q, --quiet          toggle console output  [boolean] [default: false]
		  -t, --to             upper end of the commit range to lint; applies if edit=false  [string]
		  -V, --verbose        enable verbose output for reports without problems  [boolean]
		  -s, --strict         enable strict mode; result code 2 for warnings, 3 for errors  [boolean]
		      --options        path to a JSON file or Common.js module containing CLI options
		  -v, --version        display version information  [boolean]
		  -h, --help           Show help  [boolean]"
	`);
});

test('should print version', async () => {
	const cwd = await gitBootstrap('fixtures/default');
	const result = cli(['--version'], {cwd})();
	const output = await result;
	expect(output.stdout.trim()).toMatch('@commitlint/cli@');
});

describe('should print config', () => {
	test('should print config when flag is present but without value', async () => {
		const cwd = await gitBootstrap('fixtures/default');
		const result = cli(['--print-config', 'text', '--no-color'], {cwd})();
		const output = await result;
		const stdout = output.stdout
			.trim()
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

	test('should print config when flag has `text` value', async () => {
		const cwd = await gitBootstrap('fixtures/default');
		const result = cli(['--print-config=text', '--no-color'], {cwd})();
		const output = await result;
		const stdout = output.stdout
			.trim()
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

	test('should print config when flag has `json` value', async () => {
		const cwd = await gitBootstrap('fixtures/default');
		const result = cli(['--print-config=json', '--no-color'], {cwd})();
		const output = await result;
		expect(output.stdout.trim()).toMatchInlineSnapshot(
			`"{"extends":[],"formatter":"@commitlint/format","plugins":{},"rules":{"type-enum":[2,"never",["foo"]]},"helpUrl":"https://github.com/conventional-changelog/commitlint/#what-is-commitlint","prompt":{}}"`
		);
	});
});

async function writePkg(payload: unknown, options: TestOptions) {
	const pkgPath = path.join(options.cwd, 'package.json');
	const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
	const result = merge(pkg, payload);
	await fs.writeFile(pkgPath, JSON.stringify(result, null, '  '));
}
