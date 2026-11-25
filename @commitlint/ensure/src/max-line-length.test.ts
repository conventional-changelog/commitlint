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

test("true for long line with bare email address", () => {
	const actual = ensure(
		"Co-Authored-By: my-really-long-email-address@my-really-long-domain.com",
		40,
	);
	expect(actual).toBe(true);
});

test("true for long line with angle-bracketed co-author email", () => {
	const actual = ensure(
		"Co-authored-by: Very Long Contributor Name <12345678+very-long-username@users.noreply.github.com>",
		50,
	);
	expect(actual).toBe(true);
});

test("true for long line with bot noreply email", () => {
	const actual = ensure(
		"Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
		50,
	);
	expect(actual).toBe(true);
});

test("true for long line with mailto link or punctuated email", () => {
	expect(
		ensure(
			"Contact [maintainer](mailto:my-really-long-email-address@my-really-long-domain.com).",
			40,
		),
	).toBe(true);
	expect(ensure("Please contact my-really-long-email-address@my-really-long-domain.com.", 40)).toBe(
		true,
	);
	expect(
		ensure("Signed-off-by: Seamus O'Brien <seamus.o'brien@my-really-long-domain.com>", 40),
	).toBe(true);
	expect(
		ensure("Contact `my-really-long-email-address@xn--bcher-kva.xn--p1ai` for details", 40),
	).toBe(true);
	expect(ensure("['my-really-long-email-address@EXAMPLE.XN--P1AI']", 40)).toBe(true);
	expect(
		ensure(
			"short line\r\nCo-Authored-By: my-really-long-email-address@my-really-long-domain.com\r\nshort",
			40,
		),
	).toBe(true);
});

test("false for multiline when another line exceeds max without URL or email", () => {
	const actual = ensure(
		"This plain body line is definitely longer than forty characters.\nCo-Authored-By: my-really-long-email-address@my-really-long-domain.com",
		40,
	);
	expect(actual).toBe(false);
});

test("false for long lines with non-email @ tokens", () => {
	const nonEmailLines = [
		"Upgrade @commitlint/config-conventional@20.0.0 across all workspace packages",
		"Bump pnpm@12.21.0 and @types/node@22.12.0 to the latest release versions",
		"Update pkg@1.2.3-beta.1 and pkg@1.0.0-alpha in the lockfile configuration",
		"Update actions/checkout@v7 and actions/setup-node@main across CI workflows",
		"Thanks @escapedcat for reviewing this long commit message body line carefully",
		"Replace assets/images/really-long-banner@2x.png with an optimized webp image",
		"Send local notifications to user@localhost during integration test execution",
		"Malformed addresses a@b@c.com and user@example..com and user@example.c fail",
		"Malformed domain labels user@-example.com and user@example-.com should fail",
		"Malformed local parts .user@example.com and user.@example.com should also fail",
	];

	for (const line of nonEmailLines) {
		expect(ensure(line, 40)).toBe(false);
	}
});
