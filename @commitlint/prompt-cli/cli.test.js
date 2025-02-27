import {test, expect} from 'vitest';
import {createRequire} from 'node:module';
import {git} from '@commitlint/test';
import {x} from 'tinyexec';

const require = createRequire(import.meta.url);

const bin = require.resolve('./cli.js');

const cli = (args, options) => {
	return (input = '') => {
		const result = x(bin, args, {
			nodeOptions: {
				cwd: options.cwd,
				env: options.env,
			},
		});

		result.process.stdin.write(input);
		result.process.stdin.end();

		return result;
	};
};

test('should print warning if stage is empty', async () => {
	const cwd = await git.bootstrap();
	const actual = await cli([], {cwd})('foo: bar');
	expect(actual.stdout).toContain('Nothing to commit.');
	expect(actual.stderr).toBe('');
}, 10000);
