import { test, expect } from "vitest";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { npm } from "@commitlint/test";

import config from "./index.js";

const __dirname = path.resolve(fileURLToPath(import.meta.url), "..");

test("exports rules key", () => {
	expect(config).toHaveProperty("rules");
});

test("rules hold object", () => {
	expect(config).toMatchObject({
		rules: expect.any(Object),
	});
});

test("rules contain scope-enum", () => {
	expect(config).toMatchObject({
		rules: {
			"scope-enum": expect.anything(),
		},
	});
});

test("scope-enum is function", () => {
	expect(config).toMatchObject({
		rules: {
			"scope-enum": expect.any(Function),
		},
	});
});

test("scope-enum does not throw for missing context", async () => {
	const { "scope-enum": fn } = config.rules;
	await expect(fn()).resolves.toBeTruthy();
});

test("scope-enum has expected severity", async () => {
	const { "scope-enum": fn } = config.rules;
	const [severity] = await fn();
	expect(severity).toBe(2);
});

test("scope-enum has expected modifier", async () => {
	const { "scope-enum": fn } = config.rules;
	const [, modifier] = await fn();
	expect(modifier).toBe("always");
});

test("returns global scope for empty pnpm repository", async () => {
	const { "scope-enum": fn } = config.rules;
	const cwd = await npm.bootstrap("fixtures/empty", __dirname);
	const [, , value] = await fn({ cwd });
	expect(value).toEqual(["global"]);
});

test("returns expected value for basic pnpm repository", async () => {
	const { "scope-enum": fn } = config.rules;
	const cwd = await npm.bootstrap("fixtures/basic", __dirname);

	const [, , value] = await fn({ cwd });
	expect(value).toEqual(["a", "b", "global"]);
});

test("returns expected value for scoped pnpm repository", async () => {
	const { "scope-enum": fn } = config.rules;
	const cwd = await npm.bootstrap("fixtures/scoped", __dirname);

	const [, , value] = await fn({ cwd });

	expect(value).toEqual(["a", "b", "global"]);
});

test("omits excluded workspace scopes without pruning same-named manifests", async () => {
	const cwd = await npm.bootstrap("fixtures/excluded", __dirname);
	const [, , scopes] = await config.rules["scope-enum"]({ cwd });
	expect(scopes).toEqual(["a", "global"]);
});

test("interprets a pnpm double bang", async () => {
	const cwd = await npm.bootstrap("fixtures/excluded", __dirname);
	await writeFile(
		path.join(cwd, "pnpm-workspace.yaml"),
		JSON.stringify({ packages: ["packages/*", "!!packages/a"] }),
	);
	const [, , scopes] = await config.rules["scope-enum"]({ cwd });
	expect(scopes).toEqual(["a", "b", "global"]);
});
