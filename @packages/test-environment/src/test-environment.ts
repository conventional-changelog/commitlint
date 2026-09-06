// https://github.com/raszi/node-tmp/issues/229

import type { Environment } from "vitest/runtime";
import { builtinEnvironments } from "vitest/runtime";
import tmp from "tmp";

const nodeEnv = builtinEnvironments.node;

const env: Environment = {
	...nodeEnv,
	name: "commitlint",
	viteEnvironment: "node",
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
