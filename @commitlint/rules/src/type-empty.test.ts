import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { typeEmpty } from "./type-empty.js";

const messages = {
	empty: "(scope):",
	filled: "type: subject",
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled),
};

test("without type should succeed for empty keyword", async () => {
	const [actual] = typeEmpty(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('without type should fail for "never"', async () => {
	const [actual] = typeEmpty(await parsed.empty, "never");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without type should succeed for "always"', async () => {
	const [actual] = typeEmpty(await parsed.empty, "always");
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with type fail for empty keyword", async () => {
	const [actual] = typeEmpty(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with type succeed for "never"', async () => {
	const [actual] = typeEmpty(await parsed.filled, "never");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with type fail for "always"', async () => {
	const [actual] = typeEmpty(await parsed.filled, "always");
	const expected = false;
	expect(actual).toEqual(expected);
});

test("hints at a missing colon after the type", async () => {
	const [actual, message] = typeEmpty(await parse("feat add something"), "never");
	expect(actual).toEqual(false);
	expect(message).toEqual('type may not be empty (did you forget the ":" after the type?)');
});

test("hints at a missing colon after the type and scope", async () => {
	const [, message] = typeEmpty(await parse("feat(scope) add something"), "never");
	expect(message).toEqual('type may not be empty (did you forget the ":" after the type?)');
});

test("hints at a missing space after the colon", async () => {
	const [actual, message] = typeEmpty(await parse("feat:add something"), "never");
	expect(actual).toEqual(false);
	expect(message).toEqual('type may not be empty (did you forget the space after ":"?)');
});

test("hints at a missing space after the colon of a breaking change", async () => {
	const [, message] = typeEmpty(await parse("feat(scope)!:add something"), "never");
	expect(message).toEqual('type may not be empty (did you forget the space after ":"?)');
});

test("does not hint when the header has a colon and a space", async () => {
	const [, message] = typeEmpty(await parse(": add something"), "never");
	expect(message).toEqual("type may not be empty");
});

test("does not hint for a custom header format without a colon", async () => {
	const [, message] = typeEmpty(
		await parse("-subject", undefined, {
			headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/,
			headerCorrespondence: ["type", "scope", "subject"],
		}),
		"never",
	);
	expect(message).toEqual("type may not be empty");
});
