import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		typecheck: {
			enabled: true,
		},
		exclude: ["**/node_modules/**", "**/lib/*.test.js"],
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
