import {git} from '@commitlint/test';
import execa from 'execa';

const bin = require.resolve('./cli.js');

const cli = (args, options) => {
	return (input = '') => {
		return execa(bin, args, {
			cwd: options.cwd,
			env: options.env,
			input: input,
			reject: false,
		});
	};
};

test('should print warning if stage is empty', async () => {
	const cwd = await git.bootstrap();
	const actual = await cli([], {cwd})('foo: bar');
	expect(actual.stdout).toContain('Nothing to commit.');
	expect(actual.stderr).toBe('');
});
