/**
 * Tests for "as const" compatibility:
 * https://github.com/conventional-changelog/commitlint/pull/4633
 *
 * These are compile-time type checks (no runtime behavior). If a line fails to compile, the
 * associated type definition needs to be fixed.
 */

import { RuleConfigSeverity, type RulesConfig } from "./index.js";

const ERROR = RuleConfigSeverity.Error;

const _scopeEnumObject = [ERROR, "always", { scopes: ["foo", "bar"] as const }] as const;
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

// Tests for context parameter support:
// https://github.com/conventional-changelog/commitlint/issues/4357
// Rule functions should accept an optional context parameter with cwd.

// Sync function with context
const _syncWithCtx: Partial<RulesConfig> = {
	"scope-enum": (ctx) => [ERROR, "always", ["foo", ctx?.cwd || "bar"]],
};
void _syncWithCtx;

// Async function with context
const _asyncWithCtx: Partial<RulesConfig> = {
	"scope-enum": async (ctx) => [ERROR, "always", ["foo", ctx?.cwd || "bar"]],
};
void _asyncWithCtx;

// Function without context (backward compatibility)
const _funcNoCtx: Partial<RulesConfig> = {
	"scope-enum": () => [ERROR, "always", ["foo", "bar"]],
};
void _funcNoCtx;

// Async function without context (backward compatibility)
const _asyncNoCtx: Partial<RulesConfig> = {
	"scope-enum": async () => [ERROR, "always", ["foo", "bar"]],
};
void _asyncNoCtx;
