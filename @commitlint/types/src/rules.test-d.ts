// Regression tests for "as const" compatibility.
// See: https://github.com/conventional-changelog/commitlint/pull/4633
//
// These are compile-time type checks (no runtime behaviour).
// If a line fails to compile, the associated type definition needs to be fixed.

import { RuleConfigSeverity, type RulesConfig } from "./index.js";

const ERROR = RuleConfigSeverity.Error;

// ── scope-enum ────────────────────────────────────────────────────────────────

const _scopeEnumObject = [
	ERROR,
	"always",
	{ scopes: ["foo", "bar"] as const },
] as const;
const _scopeEnumObjectCheck: Partial<RulesConfig> = {
	"scope-enum": _scopeEnumObject,
};
void _scopeEnumObjectCheck;

// Simple array form: regression check that the array-form enum config
// remains assignable to RulesConfig when using `as const`.
const _scopeEnumSimple = [ERROR, "always", ["foo", "baz", "baz"]] as const;
const _scopeEnumSimpleCheck: Partial<RulesConfig> = {
	"scope-enum": _scopeEnumSimple,
};
void _scopeEnumSimpleCheck;

// ── scope-case ────────────────────────────────────────────────────────────────

const _scopeCaseObject = [
	ERROR,
	"always",
	{ cases: ["camel-case"] as const, delimiters: ["-"] as const },
] as const;
const _scopeCaseObjectCheck: Partial<RulesConfig> = {
	"scope-case": _scopeCaseObject,
};
void _scopeCaseObjectCheck;

// Simple array form: ensure CaseRuleConfig accepts readonly arrays.
const _scopeCaseSimple = [ERROR, "always", ["camel-case"]] as const;
const _scopeCaseSimpleCheck: Partial<RulesConfig> = {
	"scope-case": _scopeCaseSimple,
};
void _scopeCaseSimpleCheck;
