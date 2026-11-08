import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import type { SyncRule } from "@commitlint/types";

import rules from "./index.js";

const run = async (message: string, when?: "always" | "never") => {
	const rule = (rules as Record<string, SyncRule | undefined>)["header-breaking-change"];
	expect(rule).toBeTypeOf("function");
	return rule!(await parse(message), when);
};

const messages = {
	space: "BREAKING CHANGE: drop node 18",
	hyphen: "BREAKING-CHANGE: drop node 18",
	exclamationMark: "feat!: drop node 18",
	footer: "feat: drop node 18\n\nBREAKING CHANGE: node 18 is no longer supported",
	lowercase: "breaking change: drop node 18",
	inSubject: "feat: explain BREAKING CHANGE: footers in the docs",
};

test('BREAKING CHANGE in the header should fail for "never"', async () => {
	const [actual, message] = await run(messages.space, "never");
	expect(actual).toEqual(false);
	expect(message).toEqual(
		"header must not start with BREAKING CHANGE; mark breaking changes with ! after the type or a BREAKING CHANGE footer",
	);
});

test("BREAKING CHANGE in the header should fail by default", async () => {
	const [actual] = await run(messages.space);
	expect(actual).toEqual(false);
});

test('BREAKING-CHANGE in the header should fail for "never"', async () => {
	const [actual] = await run(messages.hyphen, "never");
	expect(actual).toEqual(false);
});

test('BREAKING CHANGE in the header should succeed for "always"', async () => {
	const [actual, message] = await run(messages.space, "always");
	expect(actual).toEqual(true);
	expect(message).toEqual("header must start with BREAKING CHANGE");
});

test('BREAKING-CHANGE in the header should succeed for "always"', async () => {
	const [actual] = await run(messages.hyphen, "always");
	expect(actual).toEqual(true);
});

test('exclamation mark after the type should succeed for "never"', async () => {
	const [actual] = await run(messages.exclamationMark, "never");
	expect(actual).toEqual(true);
});

test('BREAKING CHANGE in the footer should succeed for "never"', async () => {
	const [actual] = await run(messages.footer, "never");
	expect(actual).toEqual(true);
});

test('lowercase breaking change should succeed for "never"', async () => {
	const [actual] = await run(messages.lowercase, "never");
	expect(actual).toEqual(true);
});

test('BREAKING CHANGE later in the header should succeed for "never"', async () => {
	const [actual] = await run(messages.inSubject, "never");
	expect(actual).toEqual(true);
});
