import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { footerMinLength } from "./footer-min-length.js";

const short = "BREAKING CHANGE: a";
const long = "BREAKING CHANGE: ab";

const value = long.length;

const messages = {
	simple: "test: subject",
	empty: "test: subject\nbody",
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`,
};

const parsed = {
	simple: parse(messages.simple),
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long),
};

test("with simple should succeed", async () => {
	const [actual] = footerMinLength(await parsed.simple, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with empty should succeed", async () => {
	const [actual] = footerMinLength(await parsed.empty, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with short should fail", async () => {
	const [actual] = footerMinLength(await parsed.short, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with long should succeed", async () => {
	const [actual] = footerMinLength(await parsed.long, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});
