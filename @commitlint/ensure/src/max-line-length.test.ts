import { test, expect } from "vitest";

import ensure from "./max-line-length.js";

test("false for no params", () => {
	const actual = (ensure as () => boolean)();
	expect(actual).toBe(false);
});

test("true for a against 1", () => {
	const actual = ensure("a", 1);
	expect(actual).toBe(true);
});

test("false for ab against 0", () => {
	const actual = ensure("a", 0);
	expect(actual).toBe(false);
});

test("true for a against 2", () => {
	const actual = ensure("a", 2);
	expect(actual).toBe(true);
});

test("true for ab against 2", () => {
	const actual = ensure("ab", 2);
	expect(actual).toBe(true);
});

test("false for ab/\nab/\nab 1", () => {
	const actual = ensure(
		`ab
ab
ab`,
		2,
	);

	expect(actual).toBe(true);
});

test("true for ab/\nab/\nab 2", () => {
	const actual = ensure(
		`ab
ab
ab`,
		2,
	);

	expect(actual).toBe(true);
});

test.each([
	[
		"GitHub noreply co-author",
		"Co-authored-by: Very Long Contributor Name <12345678+very-long-username@users.noreply.github.com>",
	],
	[
		"bot noreply signed-off-by",
		"Signed-off-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
	],
	[
		"non-ASCII contributor name",
		"Co-authored-by: José García <jose.garcia@my-really-long-domain.com>",
	],
	[
		"email without display name",
		"Co-authored-by: <my-really-long-email-address@my-really-long-domain.com>",
	],
])("true for long trailer line with email (%s)", (_label, line) => {
	expect(ensure(line, 40)).toBe(true);
});

test("true for CRLF multiline with long email trailer", () => {
	const actual = ensure(
		"short line\r\nCo-authored-by: Very Long Contributor Name <12345678+very-long-username@users.noreply.github.com>\r\nshort",
		40,
	);
	expect(actual).toBe(true);
});

test("false for multiline when another line exceeds max without URL or email trailer", () => {
	const actual = ensure(
		"This plain body line is definitely longer than forty characters.\nCo-authored-by: Very Long Contributor Name <12345678+very-long-username@users.noreply.github.com>",
		40,
	);
	expect(actual).toBe(false);
});

test.each([
	[
		"retina asset filename",
		"Replace logo@2x.png with the new one across all documentation and assets",
	],
	["scoped or tagged package", "Bump foo@next.js across all workspace packages and release notes"],
	["prerelease version", "Update pkg@1.0.0-beta.rc across all workspace packages and lockfiles"],
	[
		"inline non-trailer email",
		"Please contact my-really-long-email-address@my-really-long-domain.com for details",
	],
	[
		"trailer with bare email",
		"Co-authored-by: my-really-long-email-address@my-really-long-domain.com",
	],
	[
		"trailer with trailing text",
		"Co-authored-by: Name <user@example.com> followed by extra text over the limit",
	],
	[
		"non-trailer prefix with spaces",
		"Not a trailer: Name <my-really-long-email-address@my-really-long-domain.com>",
	],
	["malformed email with multiple @", "Co-authored-by: Name <a@b@my-really-long-domain.com>"],
])("false for long non-trailer line (%s)", (_label, line) => {
	expect(ensure(line, 40)).toBe(false);
});
