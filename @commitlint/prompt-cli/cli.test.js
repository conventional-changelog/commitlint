import { test, expect } from "vitest";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { git } from "@commitlint/test";
import { x } from "tinyexec";

const require = createRequire(import.meta.url);

const bin = require.resolve("./cli.js");

const cli = (args, options) => {
	return (input = "") => {
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

test("should print warning if stage is empty", async () => {
	const cwd = await git.bootstrap();
	const actual = await cli([], { cwd })("foo: bar");
	expect(actual.stdout).toContain("Nothing to commit.");
	expect(actual.stderr).toBe("");
}, 10000);

const stage = async (cwd) => {
	await fs.writeFile(path.join(cwd, "file.txt"), "content");
	await x("git", ["add", "file.txt"], { nodeOptions: { cwd } });
};

test.each(["--config", "-g"])(
	"should show the resolved path of a missing %s file",
	async (flag) => {
		const cwd = await git.bootstrap();
		await stage(cwd);
		const actual = await cli([flag, "missing.config.js"], { cwd })();
		expect(actual.stderr).toContain(path.join(cwd, "missing.config.js"));
	},
	10000,
);

test("should apply the rules of the config file given via --config", async () => {
	const cwd = await git.bootstrap();
	await stage(cwd);
	// Not one of the places a config is searched in by default.
	await fs.mkdir(path.join(cwd, "config"));
	await fs.writeFile(
		path.join(cwd, "config", "custom.config.mjs"),
		`export default { rules: { "type-enum": [2, "always", ["alpha", "beta"]] } };`,
	);
	const actual = await cli(["--config", "config/custom.config.mjs"], { cwd })("wrong\n");
	expect(actual.stdout).toContain("must be one of alpha, beta");
}, 10000);
