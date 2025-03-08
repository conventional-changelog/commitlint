import { test, expect } from "vitest";

import toLines from "./index.js";

test("should return an array for empty input", () => {
	expect((toLines as () => string[])()).toStrictEqual([]);
});

test("should return an array for null input", () => {
	expect((toLines as (input: any) => string[])(null)).toStrictEqual([]);
});

test("should return an array for empty string input", () => {
	expect(toLines("")).toStrictEqual([""]);
});

test("should split LF newlines", () => {
	expect(toLines("some\nweird\ntext")).toStrictEqual(["some", "weird", "text"]);
});

test("should split CR+LF newlines", () => {
	expect(toLines("some\r\nweird\r\ntext")).toStrictEqual([
		"some",
		"weird",
		"text",
	]);
});
