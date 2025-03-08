import { test, expect } from "vitest";
import type { Result } from "./types.js";
import format from "./format.js";

test("should return empty string", () => {
	const result: Result = {};
	expect(format(result)).toBe(" ");
});

test("should omit scope", () => {
	const result: Result = {
		type: "fix",
		subject: "test",
	};
	expect(format(result)).toBe("fix: test");
});

test("should include scope", () => {
	const result: Result = {
		type: "fix",
		scope: "prompt",
		subject: "test",
	};
	expect(format(result)).toBe("fix(prompt): test");
});

test("should include body", () => {
	const result: Result = {
		type: "fix",
		scope: "prompt",
		subject: "test",
		body: "some body",
	};
	expect(format(result)).toBe("fix(prompt): test\nsome body");
});

test("should include footer", () => {
	const result: Result = {
		type: "fix",
		scope: "prompt",
		subject: "test",
		footer: "some footer",
	};
	expect(format(result)).toBe("fix(prompt): test\nsome footer");
});

test("should include body and footer", () => {
	const result: Result = {
		type: "fix",
		scope: "prompt",
		subject: "test",
		body: "some body",
		footer: "some footer",
	};
	expect(format(result)).toBe("fix(prompt): test\nsome body\nsome footer");
});
