import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { scopeEmpty } from "./scope-empty.js";

const messages = {
	plain: "foo(bar): baz",
	superfluous: "foo(): baz",
	empty: "foo: baz",
};

const parsed = {
	plain: parse(messages.plain),
	superfluous: parse(messages.superfluous),
	empty: parse(messages.empty),
};

test("with plain message it should succeed for empty keyword", async () => {
	const [actual] = scopeEmpty(await parsed.plain);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with plain message it should succeed for "never"', async () => {
	const [actual] = scopeEmpty(await parsed.plain, "never");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with plain message it should fail for "always"', async () => {
	expect(scopeEmpty(await parsed.plain, "always")).toEqual([false, "scope must be empty"]);
});

test("with superfluous message it should fail for empty keyword", async () => {
	const [actual] = scopeEmpty(await parsed.superfluous);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with superfluous message it should fail for "never"', async () => {
	expect(scopeEmpty(await parsed.superfluous, "never")).toEqual([false, "scope may not be empty"]);
});

test('with superfluous message it should fail for "always"', async () => {
	expect(scopeEmpty(await parsed.superfluous, "always")).toEqual([
		false,
		'scope must be empty, remove the empty "()"',
	]);
});

test("with empty message it should fail for empty keyword", async () => {
	const [actual] = scopeEmpty(await parsed.empty);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with empty message it should fail for "never"', async () => {
	const [actual] = scopeEmpty(await parsed.empty, "never");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with empty message it should fail for "always"', async () => {
	const [actual] = scopeEmpty(await parsed.empty, "always");
	const expected = true;
	expect(actual).toEqual(expected);
});

test.each([
	["✨ feat(): something", false],
	["✨ feat()!:  something", false],
	["✨ feat: something", true],
	["✨ feat: example feat(): something", true],
])('with the emoji parser, "%s" should return %s for "always"', async (header, expected) => {
	const commit = await parse(header, undefined, {
		headerPattern: /^✨\s+(\w*)(?:\((.*)\))?!?:\s+(.*)$/,
		breakingHeaderPattern: /^✨\s+(\w*)(?:\((.*)\))?!:\s+(.*)$/,
	});
	const [actual] = scopeEmpty(commit, "always");
	expect(actual).toBe(expected);
});
