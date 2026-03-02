// Regression tests for "as const" compatibility.
// See: https://github.com/conventional-changelog/commitlint/pull/4633
//
// These are compile-time type checks (no runtime behaviour).
// If a line fails to compile, the associated type definition needs to be fixed.

import { RuleConfigSeverity, type RulesConfig } from "./index.js";

const ERROR = RuleConfigSeverity.Error;

// ── scope-enum ────────────────────────────────────────────────────────────────

// Object form: fixed in commit 26179a4
const _scopeEnumObject = [
	ERROR,
	"always",
	{ scopes: ["foo", "bar"] as const },
] as const;
const _scopeEnumObjectCheck: Partial<RulesConfig> = {
	"scope-enum": _scopeEnumObject,
};
void _scopeEnumObjectCheck;

// Simple array form: the primary use case from the PR.
// This fails until EnumRuleConfig is changed from string[] to readonly string[].
const _scopeEnumSimple = [ERROR, "always", ["foo", "baz", "baz"]] as const;
const _scopeEnumSimpleCheck: Partial<RulesConfig> = {
	"scope-enum": _scopeEnumSimple,
};
void _scopeEnumSimpleCheck;

// ── scope-case ────────────────────────────────────────────────────────────────

// Object form: fixed in commit 26179a4
const _scopeCaseObject = [
	ERROR,
	"always",
	{ cases: ["camel-case"] as const, delimiters: ["-"] as const },
] as const;
const _scopeCaseObjectCheck: Partial<RulesConfig> = {
	"scope-case": _scopeCaseObject,
};
void _scopeCaseObjectCheck;
