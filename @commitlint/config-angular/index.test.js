import { test, expect } from "vitest";
import lint from "@commitlint/lint";

import config from "./index.js";

const { rules, parserPreset } = config;

const lintMessage = async (message) => {
	const parserOpts = parserPreset.parserOpts;
	const m = message.replace(/^\s+/, "").trim();
	const result = await lint(m, rules, { parserOpts });

	if (result.errors.length > 1) {
		throw new Error(
			"Commit test should only have one error message to validate against",
		);
	}

	if (result.warnings.length > 1) {
		throw new Error(
			"Commit test should only have one warning message to validate against",
		);
	}

	return result;
};

test("a valid commit message", async () => {
	const result = await lintMessage("test: a valid angular commit");
	expect(result.valid).toBe(true);
	expect(result.errors).toStrictEqual([]);
	expect(result.warnings).toStrictEqual([]);
});

test("a valid message with a scope", async () => {
	const result = await lintMessage(
		"test(scope): a valid angular commit with a scope",
	);
	expect(result.valid).toBe(true);
	expect(result.errors).toStrictEqual([]);
	expect(result.warnings).toStrictEqual([]);
});

test("a valid multi line commit", async () => {
	const result = await lintMessage(
		`test(scope): a valid angular commit with a scope

     Some content in the body`,
	);
	expect(result.valid).toBe(true);
	expect(result.errors).toStrictEqual([]);
	expect(result.warnings).toStrictEqual([]);
});

test("a leading blank line after header", async () => {
	const result = await lintMessage(
		`test(scope): a valid angular commit with a scope
     Some content in the body`,
	);

	expect(result.valid).toBe(true);
	expect(result.errors).toStrictEqual([]);
	expect(result.warnings[0].message).toBe("body must have leading blank line");
});

test("an invalid scope", async () => {
	const result = await lintMessage(`no: no is not an invalid commit type`);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe(
		"type must be one of [build, ci, docs, feat, fix, perf, refactor, revert, style, test]",
	);
	expect(result.warnings).toStrictEqual([]);
});

test("a long header", async () => {
	const result = await lintMessage(
		`test: that its an error when there is ia realllllllllllllllllllllly long header`,
	);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe(
		"header must not be longer than 72 characters, current length is 79",
	);
	expect(result.warnings).toStrictEqual([]);
});

test("message header with ! in it", async () => {
	const result = await lintMessage(`test!: with a breaking change in the type`);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe(
		"subject must not have an exclamation mark in the subject to identify a breaking change",
	);
	expect(result.warnings).toStrictEqual([]);
});

test("message header with ! in it and a scope", async () => {
	const result = await lintMessage(
		`test(scope)!: with a breaking change in the type`,
	);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe(
		"subject must not have an exclamation mark in the subject to identify a breaking change",
	);
	expect(result.warnings).toStrictEqual([]);
});
