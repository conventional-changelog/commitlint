import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import type { Commit } from "conventional-commits-parser";
import { bodyMaxLineLength } from "./body-max-line-length.js";

const short = "a";
const long = "ab";
const url = "https://example.com/URL/with/a/very/long/path";
const email = "my-really-long-email-address@my-really-long-domain.com";

const value = short.length;

const messages = {
	empty: "test: subject",
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`,
	shortMultipleLines: `test:subject\n${short}\n${short}\n${short}`,
	longMultipleLines: `test:subject\n${short}\n${long}\n${short}`,
	urlStandalone: `test:subject\n${short}\n${url}\n${short}`,
	urlMarkdownLinkInline: `test:subject

This is a [link](${url}).`,
	urlMarkdownLinkInList: `test:subject

Link in a list:

- ${url}`,
	urlMarkdownLinkInFooter: `test:subject

Finally, [link][] via footer.

[link]: ${url}`,
	emailStandalone: `test:subject\n${short}\n${email}\n${short}`,
	emailInline: `test: subject

Contact ${email} for details.`,
	emailMailtoMarkdown: `test: subject

Contact [maintainer](mailto:${email}).`,
	emailWithLongBodyLine: `test: subject

${long}
${email}
${short}`,
};

const parsed = Object.entries(messages).reduce(
	(_parsed, [key, message]) =>
		Object.assign(_parsed, {
			[key]: parse(message),
		}),
	{} as Record<keyof typeof messages, Promise<Commit>>,
);

test("with empty should succeed", async () => {
	const [actual] = bodyMaxLineLength(await parsed.empty, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with short should succeed", async () => {
	const [actual] = bodyMaxLineLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with long should fail", async () => {
	const [actual] = bodyMaxLineLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with short with multiple lines should succeed", async () => {
	const [actual] = bodyMaxLineLength(await parsed.shortMultipleLines, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with long with multiple lines should fail", async () => {
	const [actual] = bodyMaxLineLength(await parsed.longMultipleLines, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with multiple lines and standalone URL should succeed", async () => {
	const [actual] = bodyMaxLineLength(await parsed.urlStandalone, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with multiple lines and URL in inline Markdown link should succeed", async () => {
	const [actual] = bodyMaxLineLength(await parsed.urlMarkdownLinkInline, undefined, 30);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with multiple lines and standalone email should succeed", async () => {
	const [actual] = bodyMaxLineLength(await parsed.emailStandalone, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with inline email in body should succeed", async () => {
	const [actual] = bodyMaxLineLength(await parsed.emailInline, undefined, 30);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with mailto Markdown link in body should succeed", async () => {
	const [actual] = bodyMaxLineLength(await parsed.emailMailtoMarkdown, undefined, 30);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with long body line alongside email should fail", async () => {
	const [actual] = bodyMaxLineLength(await parsed.emailWithLongBodyLine, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});
