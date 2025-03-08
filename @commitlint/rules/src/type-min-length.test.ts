import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { typeMinLength } from "./type-min-length.js";

const short = "a";
const long = "ab";

const value = long.length;

const messages = {
	empty: "():\n",
	short: `${short}: \n`,
	long: `${long}: \n`,
};

const parsed = {
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long),
};

test("with empty should succeed", async () => {
	const [actual] = typeMinLength(await parsed.empty, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with short should fail", async () => {
	const [actual] = typeMinLength(await parsed.short, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with long should succeed", async () => {
	const [actual] = typeMinLength(await parsed.long, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});
