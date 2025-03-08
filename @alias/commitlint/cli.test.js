import { test, expect } from "vitest";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { x } from "tinyexec";
import { fix } from "@commitlint/test";

const require = createRequire(import.meta.url);

const __dirname = path.resolve(fileURLToPath(import.meta.url), "..");

const bin = require.resolve("./cli.js");

function cli(args, options, input) {
	const result = x(bin, args, {
		nodeOptions: {
			cwd: options.cwd,
			env: options.env,
		},
	});

	result.process.stdin.write(input);
	result.process.stdin.end();

	return result;
}

const fixBootstrap = (fixture) => fix.bootstrap(fixture, __dirname);

test("should reprint input from stdin", async () => {
	const cwd = await fixBootstrap("fixtures/default");
	const actual = await cli([], { cwd }, "foo: bar");
	expect(actual.stdout).toContain("foo: bar");
});

test("should produce success output with --verbose flag", async () => {
	const cwd = await fixBootstrap("fixtures/default");
	const actual = await cli(["--verbose"], { cwd }, "type: bar");
	expect(actual.stdout).toContain("0 problems, 0 warnings");
	expect(actual.stderr).toEqual("");
});
