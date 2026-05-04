import { test, expect } from "vitest";
import { RuleConfigSeverity } from "@commitlint/types";

import lint from "./lint.js";

test("throws without params", async () => {
	const error = (lint as any)();
	await expect(error).rejects.toThrow("Expected a raw commit");
});

test("positive on empty message", async () => {
	expect(await lint("")).toMatchObject({
		valid: true,
		errors: [],
		warnings: [],
	});
});

test("positive on stub message and no rule", async () => {
	const actual = await lint("foo: bar");
	expect(actual.valid).toBe(true);
});

test("positive on stub message and adhered rule", async () => {
	const actual = await lint("foo: bar", {
		"type-enum": [RuleConfigSeverity.Error, "always", ["foo"]],
	});
	expect(actual.valid).toBe(true);
});

test("negative on stub message and broken rule", async () => {
	const actual = await lint("foo: bar", {
		"type-enum": [RuleConfigSeverity.Error, "never", ["foo"]],
	});
	expect(actual.valid).toBe(false);
});

test("positive on ignored message and broken rule", async () => {
	const actual = await lint('Revert "some bogus commit"', {
		"type-empty": [RuleConfigSeverity.Error, "never"],
	});
	expect(actual.valid).toBe(true);
	expect(actual.input).toBe('Revert "some bogus commit"');
});

test("negative on ignored message, disabled ignored messages and broken rule", async () => {
	const actual = await lint(
		'Revert "some bogus commit"',
		{
			"type-empty": [RuleConfigSeverity.Error, "never"],
		},
		{
			defaultIgnores: false,
		},
	);
	expect(actual.valid).toBe(false);
});

test("positive on custom ignored message and broken rule", async () => {
	const ignoredMessage = "some ignored custom message";
	const actual = await lint(
		ignoredMessage,
		{
			"type-empty": [RuleConfigSeverity.Error, "never"],
		},
		{
			ignores: [(c) => c === ignoredMessage],
		},
	);
	expect(actual.valid).toBe(true);
	expect(actual.input).toBe(ignoredMessage);
});

test("positive on stub message and opts", async () => {
	const actual = await lint(
		"foo-bar",
		{
			"type-enum": [RuleConfigSeverity.Error, "always", ["foo"]],
			"type-empty": [RuleConfigSeverity.Error, "never"],
		},
		{
			parserOpts: {
				headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/,
			},
		},
	);
	expect(actual.valid).toBe(true);
});

test("throws for invalid rule names", async () => {
	const error = lint("foo", {
		foo: [RuleConfigSeverity.Error, "always"],
		bar: [RuleConfigSeverity.Warning, "never"],
	});

	await expect(error).rejects.toThrow(
		/^Found rules without implementation: foo, bar/,
	);
});

test("throws for invalid rule config", async () => {
	const error = lint("type(scope): foo", {
		"type-enum": 1,
		"scope-enum": { 0: 2, 1: "never", 2: ["foo"], length: 3 },
	} as any);

	await expect(error).rejects.toThrow("type-enum must be array");
	await expect(error).rejects.toThrow("scope-enum must be array");
});

test("allows disable shorthand", async () => {
	const result = lint("foo", { "type-enum": [0], "scope-enum": [0] });

	await expect(result).resolves.toEqual({
		errors: [],
		input: "foo",
		valid: true,
		warnings: [],
	});
});

test("throws for rule with invalid length", async () => {
	const error = lint("type(scope): foo", { "scope-enum": [1, 2, 3, 4] } as any);

	await expect(error).rejects.toThrow("scope-enum must be 2 or 3 items long");
});

test("throws for rule with invalid level", async () => {
	const error = lint("type(scope): foo", {
		"type-enum": ["2", "always"] as any,
		"header-max-length": [{}, "always"] as any,
	});
	await expect(error).rejects.toThrow("rule type-enum must be number");
	await expect(error).rejects.toThrow("rule header-max-length must be number");
});

test("throws for rule with out of range level", async () => {
	const error = lint("type(scope): foo", {
		"type-enum": [-1, "always"] as any,
		"header-max-length": [3, "always"] as any,
	});

	await expect(error).rejects.toThrow("rule type-enum must be between 0 and 2");
	await expect(error).rejects.toThrow(
		"rule header-max-length must be between 0 and 2",
	);
});

test("throws for rule with invalid condition", async () => {
	const error = lint("type(scope): foo", {
		"type-enum": [1, 2] as any,
		"header-max-length": [1, {}] as any,
	});

	await expect(error).rejects.toThrow("type-enum must be string");
	await expect(error).rejects.toThrow("header-max-length must be string");
});

test("throws for rule with out of range condition", async () => {
	const error = lint("type(scope): foo", {
		"type-enum": [RuleConfigSeverity.Warning, "foo"] as any,
		"header-max-length": [RuleConfigSeverity.Warning, "bar"] as any,
	});

	await expect(error).rejects.toThrow('type-enum must be "always" or "never"');
	await expect(error).rejects.toThrow(
		'header-max-length must be "always" or "never"',
	);
});

test("succeds for issue", async () => {
	const report = await lint("something #1", {
		"references-empty": [RuleConfigSeverity.Error, "never"],
	});

	expect(report.valid).toBe(true);
});

test("fails for issue", async () => {
	const report = await lint("something #1", {
		"references-empty": [RuleConfigSeverity.Error, "always"],
	});

	expect(report.valid).toBe(false);
});

test("succeds for custom issue prefix", async () => {
	const report = await lint(
		"something REF-1",
		{
			"references-empty": [RuleConfigSeverity.Error, "never"],
		},
		{
			parserOpts: {
				issuePrefixes: ["REF-"],
			},
		},
	);

	expect(report.valid).toBe(true);
});

test("fails for custom issue prefix", async () => {
	const report = await lint(
		"something #1",
		{
			"references-empty": [RuleConfigSeverity.Error, "never"],
		},
		{
			parserOpts: {
				issuePrefixes: ["REF-"],
			},
		},
	);

	expect(report.valid).toBe(false);
});

test("fails for custom plugin rule", async () => {
	const report = await lint(
		"something #1",
		{
			"plugin-rule": [RuleConfigSeverity.Error, "never"],
		},
		{
			plugins: {
				"plugin-example": {
					rules: {
						"plugin-rule": () => [false],
					},
				},
			},
		},
	);

	expect(report.valid).toBe(false);
});

test("passes for custom plugin rule", async () => {
	const report = await lint(
		"something #1",
		{
			"plugin-rule": [RuleConfigSeverity.Error, "never"],
		},
		{
			plugins: {
				"plugin-example": {
					rules: {
						"plugin-rule": () => [true],
					},
				},
			},
		},
	);

	expect(report.valid).toBe(true);
});

test("returns original message only with commit header", async () => {
	const message = "foo: bar";
	const report = await lint(message);

	expect(report.input).toBe(message);
});

test("returns original message with commit header and body", async () => {
	const message = "foo: bar/n/nFoo bar bizz buzz.";
	const report = await lint(message);

	expect(report.input).toBe(message);
});

test("returns original message with commit header, body and footer", async () => {
	const message = "foo: bar/n/nFoo bar bizz buzz./n/nCloses #1";
	const report = await lint(message);

	expect(report.input).toBe(message);
});

test("returns original message with commit header, body and footer, parsing comments", async () => {
	const expected = "foo: bar/n/nFoo bar bizz buzz./n/nCloses #1";
	const message = `${expected}\n\n# Some comment to ignore`;
	const report = await lint(
		message,
		{
			"references-empty": [RuleConfigSeverity.Error, "never"],
		},
		{
			parserOpts: {
				commentChar: "#",
			},
		},
	);

	expect(report.input).toBe(expected);
});

test("passes for async rule", async () => {
	const report = await lint(
		"something #1",
		{
			"async-rule": [RuleConfigSeverity.Error, "never"],
		},
		{
			plugins: {
				"example-plugin": {
					rules: {
						"async-rule": async () => [true, "all good"] as const,
					},
				},
			},
		},
	);

	expect(report.valid).toBe(true);
});

test("returns position for type-enum error", async () => {
	const result = await lint("foo: some message", {
		"type-enum": [RuleConfigSeverity.Error, "always", ["feat", "fix"]],
	});
	expect(result.valid).toBe(false);
	expect(result.errors).toHaveLength(1);
	expect(result.errors[0].name).toBe("type-enum");
	expect(result.errors[0].start).toEqual({ line: 1, column: 1, offset: 0 });
	expect(result.errors[0].end).toEqual({ line: 1, column: 4, offset: 3 });
});

test("returns position for type-case error", async () => {
	const result = await lint("FIX: some message", {
		"type-case": [RuleConfigSeverity.Error, "always", "lower-case"],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("type-case");
	expect(result.errors[0].start).toEqual({ line: 1, column: 1, offset: 0 });
	expect(result.errors[0].end).toEqual({ line: 1, column: 4, offset: 3 });
});

test("returns position for type-max-length error", async () => {
	const longType = "toolongtype";
	const result = await lint(`${longType}: some message`, {
		"type-max-length": [RuleConfigSeverity.Error, "always", 5],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("type-max-length");
	expect(result.errors[0].start).toEqual({ line: 1, column: 1, offset: 0 });
	expect(result.errors[0].end).toEqual({
		line: 1,
		column: longType.length + 1,
		offset: longType.length,
	});
});

test("returns position for scope-enum error", async () => {
	const result = await lint("feat(badscope): some message", {
		"scope-enum": [RuleConfigSeverity.Error, "always", ["cli", "core"]],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("scope-enum");
	expect(result.errors[0].start).toEqual({ line: 1, column: 6, offset: 5 });
	expect(result.errors[0].end).toEqual({ line: 1, column: 14, offset: 13 });
});

test("returns position for scope-case error", async () => {
	const result = await lint("feat(SCOPE): some message", {
		"scope-case": [RuleConfigSeverity.Error, "always", "lower-case"],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("scope-case");
	expect(result.errors[0].start).toEqual({ line: 1, column: 6, offset: 5 });
	expect(result.errors[0].end).toEqual({ line: 1, column: 11, offset: 10 });
});

test("returns position for subject-max-length error", async () => {
	const longSubject =
		"this is a very long subject that exceeds the maximum allowed characters";
	const result = await lint(`feat: ${longSubject}`, {
		"subject-max-length": [RuleConfigSeverity.Error, "always", 20],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("subject-max-length");
	expect(result.errors[0].start?.line).toBe(1);
	expect(result.errors[0].start?.column).toBeGreaterThan(5);
	expect(result.errors[0].end?.line).toBe(1);
});

test("returns position for subject-full-stop error", async () => {
	const result = await lint("feat: some message.", {
		"subject-full-stop": [RuleConfigSeverity.Error, "never", "."],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("subject-full-stop");
	expect(result.errors[0].start?.line).toBe(1);
	expect(result.errors[0].start?.column).toBeGreaterThan(5);
});

test("returns position for header-max-length error", async () => {
	const longHeader =
		"feat: this is a very long header that definitely exceeds the maximum allowed character limit for commit messages";
	const result = await lint(longHeader, {
		"header-max-length": [RuleConfigSeverity.Error, "always", 50],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("header-max-length");
	expect(result.errors[0].start).toEqual({ line: 1, column: 1, offset: 0 });
	expect(result.errors[0].end).toEqual({
		line: 1,
		column: longHeader.length + 1,
		offset: longHeader.length,
	});
});

test("returns position for body-max-line-length error", async () => {
	const longBodyLine =
		"this is a body line that is way too long and exceeds the maximum allowed character limit of one hundred characters for each line in the body";
	const result = await lint(`feat: some message\n\n${longBodyLine}`, {
		"body-max-line-length": [RuleConfigSeverity.Error, "always", 80],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("body-max-line-length");
	expect(result.errors[0].start?.line).toBe(3);
});

test("returns subject position even when type and subject share text", async () => {
	const result = await lint("foo: foo", {
		"subject-min-length": [RuleConfigSeverity.Error, "always", 10],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("subject-min-length");
	expect(result.errors[0].start?.column).toBe(6);
});

test("returns correct footer line for multi-line body", async () => {
	const longFooter =
		"BREAKING CHANGE: a footer line that is far too long to fit within the configured maximum allowed character limit for the footer";
	const message = `feat: head\n\nbody line 1\nbody line 2\nbody line 3\n\n${longFooter}`;
	const result = await lint(message, {
		"footer-max-line-length": [RuleConfigSeverity.Error, "always", 80],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("footer-max-line-length");
	expect(result.errors[0].start?.line).toBe(7);
});

test("returns position for body-leading-blank when blank is missing", async () => {
	const result = await lint("feat: head\nbody content", {
		"body-leading-blank": [RuleConfigSeverity.Error, "always"],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("body-leading-blank");
	expect(result.errors[0].start).toBeDefined();
});

test("returns position for footer-leading-blank when blank is missing", async () => {
	const result = await lint("feat: head\n\nbody\nBREAKING CHANGE: something", {
		"footer-leading-blank": [RuleConfigSeverity.Error, "always"],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("footer-leading-blank");
	expect(result.errors[0].start).toBeDefined();
});

test("returns no position for rules without position support", async () => {
	const result = await lint("something #1", {
		"references-empty": [RuleConfigSeverity.Error, "always"],
	});
	expect(result.valid).toBe(false);
	expect(result.errors[0].name).toBe("references-empty");
	expect(result.errors[0].start).toBeUndefined();
	expect(result.errors[0].end).toBeUndefined();
});

test("returns correct position for valid commit (no position needed)", async () => {
	const result = await lint("feat: add new feature", {
		"type-enum": [RuleConfigSeverity.Error, "always", ["feat", "fix"]],
	});
	expect(result.valid).toBe(true);
	expect(result.errors).toHaveLength(0);
});
