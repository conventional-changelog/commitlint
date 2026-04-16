import { describe, test, expect } from "vitest";
import { defineConfig } from "./define-config.js";

describe("defineConfig", () => {
	test("should return the given config", () => {
		const config = {
			extends: ["@commitlint/config-conventional"],
			rules: {
				"type-enum": [2, "always", ["feat", "fix"]],
			},
		};
		expect(defineConfig(config)).toEqual(config);
	});

	test("should work with empty config", () => {
		expect(defineConfig({})).toEqual({});
	});

	test("should preserve all config properties", () => {
		const config = {
			extends: ["@commitlint/config-conventional"],
			rules: {
				"type-enum": [
					2,
					"always",
					[
						"feat",
						"fix",
						"docs",
						"style",
						"refactor",
						"perf",
						"test",
						"build",
						"ci",
						"chore",
						"revert",
					],
				],
			},
			formatter: "@commitlint/format",
			helpUrl:
				"https://github.com/conventional-changelog/commitlint/#what-is-commitlint",
		};
		expect(defineConfig(config)).toEqual(config);
	});
});
