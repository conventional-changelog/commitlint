import { test, expect } from "vitest";

import ensure from "./enum.js";

test("false for no params", () => {
	const actual = (ensure as () => boolean)();
	expect(actual).toBe(false);
});

test("false for not array enums", () => {
	const actual = ensure("a", "a" as any);
	expect(actual).toBe(false);
});

test("true for a against a", () => {
	const actual = ensure("a", ["a"]);
	expect(actual).toBe(true);
});

test("false for a against b", () => {
	const actual = ensure("a", ["b"]);
	expect(actual).toBe(false);
});

test("true for a against a, b", () => {
	const actual = ensure("a", ["a", "b"]);
	expect(actual).toBe(true);
});

test("false for b against a", () => {
	const actual = ensure("b", ["a"]);
	expect(actual).toBe(false);
});

test("true for b against b", () => {
	const actual = ensure("b", ["b"]);
	expect(actual).toBe(true);
});

test("true for b against a, b", () => {
	const actual = ensure("b", ["a", "b"]);
	expect(actual).toBe(true);
});

test("false for c against a, b", () => {
	const actual = ensure("c", ["a", "b"]);
	expect(actual).toBe(false);
});
