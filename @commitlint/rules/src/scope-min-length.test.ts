import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { scopeMinLength } from "./scope-min-length.js";

const short = "a";
const long = "ab";

const value = long.length;

const messages = {
	empty: "test:\n",
	short: `test(${short}): \n`,
	long: `test(${long}): \n`,
};

const parsed = {
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long),
};

test("with empty should succeed", async () => {
	const [actual] = scopeMinLength(await parsed.empty, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with short should fail", async () => {
	const [actual] = scopeMinLength(await parsed.short, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with long should succeed", async () => {
	const [actual] = scopeMinLength(await parsed.long, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});
