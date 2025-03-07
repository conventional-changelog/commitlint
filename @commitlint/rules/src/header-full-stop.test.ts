import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { headerFullStop } from "./header-full-stop.js";

const messages = {
	with: `header.\n`,
	without: `header\n`,
};

const parsed = {
	with: parse(messages.with),
	without: parse(messages.without),
};

test('with against "always ." should succeed', async () => {
	const [actual] = headerFullStop(await parsed.with, "always", ".");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "never ." should fail', async () => {
	const [actual] = headerFullStop(await parsed.with, "never", ".");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "always ." should fail', async () => {
	const [actual] = headerFullStop(await parsed.without, "always", ".");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "never ." should succeed', async () => {
	const [actual] = headerFullStop(await parsed.without, "never", ".");
	const expected = true;
	expect(actual).toEqual(expected);
});
