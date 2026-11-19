import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { subjectEmpty } from "./subject-empty.js";

const messages = {
	empty: "test: \nbody",
	filled: "test: subject\nbody",
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled),
};

const hints = {
	add: 'add a subject after the type, e.g. "feat(Compiler): add new feature"',
	absent: 'leave out the subject, e.g. "feat:"',
};

test("without subject should succeed for empty keyword", async () => {
	const [actual, message, hint] = subjectEmpty(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.absent);
});

test('without subject should fail for "never"', async () => {
	const [actual, message, hint] = subjectEmpty(await parsed.empty, "never");
	const expected = false;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.add);
});

test('without subject should succeed for "always"', async () => {
	const [actual, message, hint] = subjectEmpty(await parsed.empty, "always");
	const expected = true;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.absent);
});

test("with subject fail for empty keyword", async () => {
	const [actual, message, hint] = subjectEmpty(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.absent);
});

test('with subject succeed for "never"', async () => {
	const [actual, message, hint] = subjectEmpty(await parsed.filled, "never");
	const expected = true;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.add);
});

test('with subject fail for "always"', async () => {
	const [actual, message, hint] = subjectEmpty(await parsed.filled, "always");
	const expected = false;
	expect(actual).toEqual(expected);
	expect(message).toBeDefined();
	expect(hint).toEqual(hints.add);
});
