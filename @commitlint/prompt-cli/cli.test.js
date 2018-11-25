import path from 'path';
import {git} from '@commitlint/test';
import test from 'ava';
import execa from 'execa';
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

test('should print warning if stage is empty', async t => {
	const cwd = await git.bootstrap();
	const actual = await cli([], {cwd})('foo: bar');
	t.true(actual.stdout.includes('Nothing to commit.'));
});
