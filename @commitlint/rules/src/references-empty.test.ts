import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { referencesEmpty } from "./references-empty.js";

// @ts-expect-error -- no typings
import preset from "conventional-changelog-angular";

const messages = {
	plain: "foo: bar",
	comment: "foo: baz\n#1 Comment",
	reference: "#comment\nfoo: baz \nCloses #1",
	references: "#comment\nfoo: bar \nCloses #1, #2, #3",
	prefix: "bar REF-1234",
};

const opts = (async () => {
	const o = await preset();
	o.parserOpts.commentChar = "#";
	return o;
})();

const parsed = {
	plain: (async () =>
		parse(messages.plain, undefined, (await opts).parserOpts))(),
	comment: (async () =>
		parse(messages.comment, undefined, (await opts).parserOpts))(),
	reference: (async () =>
		parse(messages.reference, undefined, (await opts).parserOpts))(),
	references: (async () =>
		parse(messages.references, undefined, (await opts).parserOpts))(),
	prefix: parse(messages.prefix, undefined, {
		issuePrefixes: ["REF-"],
	}),
};

test("defaults to never and fails for plain", async () => {
	const [actual] = referencesEmpty(await parsed.plain);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("defaults to never and succeeds for reference", async () => {
	const [actual] = referencesEmpty(await parsed.reference);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("fails for comment with never", async () => {
	const [actual] = referencesEmpty(await parsed.comment, "never");
	const expected = false;
	expect(actual).toEqual(expected);
});

test("succeeds for comment with always", async () => {
	const [actual] = referencesEmpty(await parsed.comment, "always");
	const expected = true;
	expect(actual).toEqual(expected);
});

test("succeeds for reference with never", async () => {
	const [actual] = referencesEmpty(await parsed.reference, "never");
	const expected = true;
	expect(actual).toEqual(expected);
});

test("fails for reference with always", async () => {
	const [actual] = referencesEmpty(await parsed.reference, "always");
	const expected = false;
	expect(actual).toEqual(expected);
});

test("succeeds for references with never", async () => {
	const [actual] = referencesEmpty(await parsed.references, "never");
	const expected = true;
	expect(actual).toEqual(expected);
});

test("fails for references with always", async () => {
	const [actual] = referencesEmpty(await parsed.references, "always");
	const expected = false;
	expect(actual).toEqual(expected);
});

test("succeeds for custom references with always", async () => {
	const [actual] = referencesEmpty(await parsed.prefix, "never");
	const expected = true;
	expect(actual).toEqual(expected);
});
