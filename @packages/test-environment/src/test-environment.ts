// https://github.com/raszi/node-tmp/issues/229

import type {Environment} from 'vitest';
import {builtinEnvironments} from 'vitest/environments';
import tmp from 'tmp';

const nodeEnv = builtinEnvironments.node;

const env: Environment = {
	...nodeEnv,
	name: 'commitlint',
	async setup(global: object, options: Record<string, unknown>) {
		const setupEnv = await nodeEnv.setup(global, options);
		return {
			...setupEnv,
			teardown(global: unknown) {
				tmp.setGracefulCleanup();
				return setupEnv.teardown(global);
			},
		};
	},
};

export default env;
