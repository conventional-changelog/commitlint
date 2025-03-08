import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { bodyMaxLength } from "./body-max-length.js";

const short = "a";
const long = "ab";

const value = short.length;

const messages = {
	empty: "test: subject",
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`,
};

const parsed = {
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long),
};

test("with empty should succeed", async () => {
	const [actual] = bodyMaxLength(await parsed.empty, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with short should succeed", async () => {
	const [actual] = bodyMaxLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with long should fail", async () => {
	const [actual] = bodyMaxLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});
