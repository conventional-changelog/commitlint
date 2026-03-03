import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		typecheck: {
			enabled: true,
		},
		exclude: ["**/node_modules/**", "**/lib/*.test.js", "**/lib/*.test.ts"],
		environment: "commitlint",
		coverage: {
			provider: "istanbul",
			include: ["**/@commitlint/*/src/**"],
		},
	},
	environments: {
		node: {},
	},
});
