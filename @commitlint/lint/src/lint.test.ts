import { test, expect, vi } from "vitest";
import type { Parser } from "@commitlint/types";
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

test("positive on custom ignored message with trailing newlines", async () => {
	const ignoredMessage = "Initialize project using Create React App";
	const actual = await lint(
		`${ignoredMessage}\n\n`,
		{
			"type-empty": [RuleConfigSeverity.Error, "never"],
			"subject-empty": [RuleConfigSeverity.Error, "never"],
		},
		{
			ignores: [(c) => c === ignoredMessage],
		},
	);
	expect(actual.valid).toBe(true);
	expect(actual.errors).toEqual([]);
});

test("passes the message without trailing whitespace to ignore matchers", async () => {
	const matcher = vi.fn(() => false);
	await lint("feat: thing\n\nbody\n\n", {}, { ignores: [matcher] });
	expect(matcher).toHaveBeenCalledWith("feat: thing\n\nbody");
});

test("keeps leading whitespace in the message passed to ignore matchers", async () => {
	// The default matchers are anchored to the start of the message, so trimming
	// the start would start ignoring messages that are linted today.
	const matcher = vi.fn(() => false);
	await lint("\nfeat: thing\n\n", {}, { ignores: [matcher] });
	expect(matcher).toHaveBeenCalledWith("\nfeat: thing");
});

test("negative on a semver message behind a leading blank line", async () => {
	const actual = await lint("\nv1.2.3\n\n", {
		"type-empty": [RuleConfigSeverity.Error, "never"],
	});
	expect(actual.valid).toBe(false);
});

test("positive on whitespace only message and the documented empty ignore matcher", async () => {
	const matcher = vi.fn((commit: string) => commit === "");
	await expect(
		lint(
			"\n\n",
			{
				"type-empty": [RuleConfigSeverity.Error, "never"],
			},
			{ ignores: [matcher] },
		),
	).resolves.toMatchObject({ valid: true });
	expect(matcher).toHaveBeenCalledWith("");
});

test("reports the message as given for ignored messages", async () => {
	const message = "Initialize project using Create React App\n\n";
	const actual = await lint(
		message,
		{},
		{ ignores: [(c) => c === "Initialize project using Create React App"] },
	);
	expect(actual.input).toBe(message);
});

test("keeps the message as it was read when evaluating rules", async () => {
	// `parsed.raw` is line-indexed by body-leading-blank and footer-leading-blank,
	// so rules must keep seeing the message exactly as it was read.
	const actual = await lint("\nfeat: thing\n\nbody\n\n", {
		"body-leading-blank": [RuleConfigSeverity.Error, "always"],
	});
	expect(actual.valid).toBe(false);
	expect(actual.errors.map((error) => error.name)).toEqual(["body-leading-blank"]);
});

test("parses a multi line message the same way with or without a trailing newline", async () => {
	const message = "feat: thing\n\nbody line one\n\nbody line two\n\nBREAKING CHANGE: nope";
	const rules = {
		"body-leading-blank": [RuleConfigSeverity.Error, "always"],
		"footer-leading-blank": [RuleConfigSeverity.Error, "always"],
		"body-max-line-length": [RuleConfigSeverity.Error, "always", 10],
	} as const;

	const withTrailingNewlines = await lint(`${message}\n\n`, rules);
	const withoutTrailingNewlines = await lint(message, rules);

	expect(withTrailingNewlines.valid).toBe(withoutTrailingNewlines.valid);
	expect(withTrailingNewlines.errors).toEqual(withoutTrailingNewlines.errors);
	expect(withTrailingNewlines.warnings).toEqual(withoutTrailingNewlines.warnings);
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

	await expect(error).rejects.toThrow(/^Found rules without implementation: foo, bar/);
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
	await expect(error).rejects.toThrow("rule header-max-length must be between 0 and 2");
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
	await expect(error).rejects.toThrow('header-max-length must be "always" or "never"');
});

test("succeds for issue", async () => {
	const report = await lint("somehting #1", {
		"references-empty": [RuleConfigSeverity.Error, "never"],
	});

	expect(report.valid).toBe(true);
});

test("fails for issue", async () => {
	const report = await lint("somehting #1", {
		"references-empty": [RuleConfigSeverity.Error, "always"],
	});

	expect(report.valid).toBe(false);
});

test("succeds for custom issue prefix", async () => {
	const report = await lint(
		"somehting REF-1",
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
		"somehting #1",
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
		"somehting #1",
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
		"somehting #1",
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
		"somehting #1",
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

test("custom parser output is used by rules", async () => {
	// The default parser extracts no type from this message; the custom parser supplies one,
	// so type-empty (never) only passes because the custom parser ran.
	const customParser: Parser = (message) => ({
		type: "feat",
		scope: null,
		subject: "my-feature",
		body: null,
		footer: null,
		header: message,
	});

	const report = await lint(
		"a message with no conventional type",
		{
			"type-empty": [RuleConfigSeverity.Error, "never"],
		},
		{ parser: customParser },
	);

	expect(report.valid).toBe(true);
	expect(report.errors.length).toBe(0);
});

test("custom parser overrides the default parse result", async () => {
	// "feat: add thing" is a valid feat to the default parser; the custom parser rewrites the
	// type to "wip", so the commit only fails type-enum because the custom parser ran.
	const customParser: Parser = (message) => ({
		type: "wip",
		scope: null,
		subject: "add thing",
		body: null,
		footer: null,
		header: message,
	});

	const report = await lint(
		"feat: add thing",
		{
			"type-enum": [RuleConfigSeverity.Error, "always", ["feat"]],
		},
		{ parser: customParser },
	);

	expect(report.valid).toBe(false);
	expect(report.errors.length).toBe(1);
});

test("custom parser receives parser options as second argument", async () => {
	let receivedOpts: Record<string, unknown> | undefined;

	const customParser: Parser = (_message, opts) => {
		receivedOpts =
			typeof opts === "object" && opts !== null ? (opts as Record<string, unknown>) : {};
		return {
			header: "custom-parsed-header",
			type: "chore",
			subject: null,
			body: null,
			footer: null,
			merge: null,
			revert: null,
			notes: [],
			mentions: [],
			references: [],
		} as unknown as ReturnType<Parser>;
	};

	const customOpts = { headerPattern: /^custom-parsed-header/ };

	await lint(
		"any message",
		{
			"type-enum": [RuleConfigSeverity.Error, "always", ["chore"]],
		},
		{ parser: customParser, parserOpts: customOpts },
	);

	expect(receivedOpts).toBeDefined();
	expect((receivedOpts as Record<string, unknown>).headerPattern).toBeDefined();
});
