import execa from 'execa';
import {fix} from '@commitlint/test';

const bin = require.resolve('./cli.js');

function cli(args, options, input) {
	const c = execa(bin, args, {
		cwd: options.cwd,
		env: options.env,
		input: input,
	});
	return c.catch((err) => err);
}

const fixBootstrap = (fixture) => fix.bootstrap(fixture, __dirname);

test('should reprint input from stdin', async () => {
	const cwd = await fixBootstrap('fixtures/default');
	const actual = await cli([], {cwd}, 'foo: bar');
	expect(actual.stdout).toContain('foo: bar');
});

test('should produce success output with --verbose flag', async () => {
	const cwd = await fixBootstrap('fixtures/default');
	const actual = await cli(['--verbose'], {cwd}, 'type: bar');
	expect(actual.stdout).toContain('0 problems, 0 warnings');
	expect(actual.stderr).toEqual('');
});
