/**
 * Tests for "as const" compatibility:
 * https://github.com/conventional-changelog/commitlint/pull/4633
 *
 * These are compile-time type checks (no runtime behavior). If a line fails to compile, the
 * associated type definition needs to be fixed.
 */

import { assertType, test } from "vitest";

import { RuleConfigSeverity, type RulesConfig } from "./index.js";

const ERROR = RuleConfigSeverity.Error;

test("scope-enum accepts an as-const object config", () => {
	const scopeEnumObject = [ERROR, "always", { scopes: ["foo", "bar"] as const }] as const;
	assertType<Partial<RulesConfig>>({ "scope-enum": scopeEnumObject });
});

// Simple array form: regression check that the array-form enum config
// remains assignable to RulesConfig when using `as const`.
test("scope-enum accepts an as-const array config", () => {
	const scopeEnumSimple = [ERROR, "always", ["foo", "baz", "baz"]] as const;
	assertType<Partial<RulesConfig>>({ "scope-enum": scopeEnumSimple });
});

test("scope-case accepts an as-const object config", () => {
	const scopeCaseObject = [
		ERROR,
		"always",
		{ cases: ["camel-case"] as const, delimiters: ["-"] as const },
	] as const;
	assertType<Partial<RulesConfig>>({ "scope-case": scopeCaseObject });
});

// Simple array form: ensure CaseRuleConfig accepts readonly arrays.
test("scope-case accepts an as-const array config", () => {
	const scopeCaseSimple = [ERROR, "always", ["camel-case"]] as const;
	assertType<Partial<RulesConfig>>({ "scope-case": scopeCaseSimple });
});

// Regression check: breaking-change-exclamation-mark has no target case, so it
// must accept a plain two-element tuple.
test("breaking-change-exclamation-mark accepts a two-element tuple", () => {
	const breakingChangeExclamationMark = [ERROR, "always"] as const;
	assertType<Partial<RulesConfig>>({
		"breaking-change-exclamation-mark": breakingChangeExclamationMark,
	});
});

// Tests for context parameter support:
// https://github.com/conventional-changelog/commitlint/issues/4357
// Rule functions should accept an optional context parameter with cwd.

test("sync rule function accepts a context parameter", () => {
	assertType<Partial<RulesConfig>>({
		"scope-enum": (ctx) => [ERROR, "always", ["foo", ctx?.cwd || "bar"]],
	});
});

test("async rule function accepts a context parameter", () => {
	assertType<Partial<RulesConfig>>({
		"scope-enum": async (ctx) => [ERROR, "always", ["foo", ctx?.cwd || "bar"]],
	});
});

test("sync rule function without context stays assignable", () => {
	assertType<Partial<RulesConfig>>({
		"scope-enum": () => [ERROR, "always", ["foo", "bar"]],
	});
});

test("async rule function without context stays assignable", () => {
	assertType<Partial<RulesConfig>>({
		"scope-enum": async () => [ERROR, "always", ["foo", "bar"]],
	});
});
