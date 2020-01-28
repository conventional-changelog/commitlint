import {git} from '@commitlint/test';
import execa from 'execa';
import stream from 'string-to-stream';

const bin = require.resolve('./cli.js');

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

test('should print warning if stage is empty', async () => {
	const cwd = await git.bootstrap();
	const actual = await cli([], {cwd})('foo: bar');
	expect(actual.stdout).toContain('Nothing to commit.');
	expect(actual.stderr).toBe('');
});
