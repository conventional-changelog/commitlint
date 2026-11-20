import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { bodyEmpty } from "./body-empty.js";

const messages = {
	empty: "test: subject",
	filled: "test: subject\nbody",
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled),
};

const hints = {
	add: 'add a description after the header, e.g. "Added new feature"',
	omit: 'leave out the description, e.g. "Added new feature:"',
};

test("with empty body should succeed for empty keyword", async () => {
	const [actual, message, hint] = bodyEmpty(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.omit);
});

test('with empty body should fail for "never"', async () => {
	const [actual, message, hint] = bodyEmpty(await parsed.empty, "never");
	const expected = false;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.add);
});

test('with empty body should succeed for "always"', async () => {
	const [actual, message, hint] = bodyEmpty(await parsed.empty, "always");
	const expected = true;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.omit);
});

test("with body should fail for empty keyword", async () => {
	const [actual, message, hint] = bodyEmpty(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.omit);
});

test('with body should succeed for woogie "never"', async () => {
	const [actual, message, hint] = bodyEmpty(await parsed.filled, "never");
	const expected = true;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.add);
});

test('with body should fail for "always"', async () => {
	const [actual, message, hint] = bodyEmpty(await parsed.filled, "always");
	const expected = false;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.omit);
});
