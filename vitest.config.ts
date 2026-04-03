import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		typecheck: {
			enabled: true,
		},
		env: {
			HOME: process.cwd(),
			LANG: "en_US.UTF-8",
			NO_COLOR: "1",
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
