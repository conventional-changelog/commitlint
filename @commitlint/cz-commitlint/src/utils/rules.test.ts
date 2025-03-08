import { test, expect } from "vitest";
import { RuleConfigSeverity } from "@commitlint/types";

import {
	enumRuleIsActive,
	getEnumList,
	getMaxLength,
	getMinLength,
	ruleIsActive,
	ruleIsApplicable,
	ruleIsDisabled,
	ruleIsNotApplicable,
} from "./rules.js";

test("ruleIsDisabled", () => {
	expect(ruleIsDisabled([RuleConfigSeverity.Disabled])).toBe(true);
	expect(ruleIsDisabled([RuleConfigSeverity.Disabled, "never"])).toBe(true);
	expect(ruleIsDisabled([RuleConfigSeverity.Disabled, "always"])).toBe(true);
	expect(ruleIsDisabled([RuleConfigSeverity.Error] as any)).toBe(false);
	expect(ruleIsDisabled([RuleConfigSeverity.Error, "always"] as any)).toBe(
		false,
	);
});

test("ruleIsActive", () => {
	expect(ruleIsActive([RuleConfigSeverity.Error, "always"])).toBe(true);
	expect(ruleIsActive([RuleConfigSeverity.Warning, "never"])).toBe(true);
	expect(ruleIsActive([RuleConfigSeverity.Disabled, "always"])).toBe(false);
	expect(ruleIsActive([RuleConfigSeverity.Error] as any)).toBe(true);
});

test("ruleIsApplicable", () => {
	expect(ruleIsApplicable([RuleConfigSeverity.Error, "always"])).toBe(true);
	expect(ruleIsApplicable([RuleConfigSeverity.Warning, "always"])).toBe(true);
	expect(ruleIsApplicable([RuleConfigSeverity.Disabled, "always"])).toBe(true);
	expect(ruleIsApplicable(undefined as any)).toBe(false);
	expect(ruleIsApplicable("" as any)).toBe(false);
	expect(ruleIsApplicable([RuleConfigSeverity.Disabled])).toBe(false);
	expect(ruleIsApplicable([RuleConfigSeverity.Disabled, "never"])).toBe(false);
});

test("ruleIsNotApplicable", () => {
	expect(ruleIsNotApplicable([RuleConfigSeverity.Error, "never"])).toBe(true);
	expect(ruleIsNotApplicable([RuleConfigSeverity.Warning, "never"])).toBe(true);
	expect(ruleIsNotApplicable([RuleConfigSeverity.Disabled, "never"])).toBe(
		true,
	);
	expect(ruleIsNotApplicable(undefined as any)).toBe(false);
	expect(ruleIsNotApplicable("" as any)).toBe(false);
	expect(ruleIsNotApplicable([RuleConfigSeverity.Error] as any)).toBe(false);
	expect(ruleIsNotApplicable([RuleConfigSeverity.Error, "always"])).toBe(false);
	expect(ruleIsNotApplicable([RuleConfigSeverity.Error, "always", 100])).toBe(
		false,
	);
});

test("getMaxLength", () => {
	expect(getMaxLength([RuleConfigSeverity.Error, "always", 100])).toBe(100);
	expect(getMaxLength([RuleConfigSeverity.Warning, "never"])).toBe(Infinity);
	expect(getMaxLength([RuleConfigSeverity.Disabled, "always"])).toBe(Infinity);
	expect(getMaxLength([RuleConfigSeverity.Error] as any)).toBe(Infinity);

	const rules: any = {
		"body-max-line-length": [RuleConfigSeverity.Error, "always", 100],
		"header-max-length": [RuleConfigSeverity.Error, "always", 100],
		"test-max-length": [RuleConfigSeverity.Disabled, "always", 100],
	};
	let lengthRule = rules["header-max-length"];
	expect(getMaxLength(lengthRule)).toBe(100);

	lengthRule = rules["body-max-line-length"];
	expect(getMaxLength(lengthRule)).toBe(100);

	lengthRule = rules["body-max-length"];
	expect(getMaxLength(lengthRule)).toBe(Infinity);

	lengthRule = rules["test-max-length"];
	expect(getMaxLength(lengthRule)).toBe(Infinity);
});

test("getMinLength", () => {
	expect(getMinLength([RuleConfigSeverity.Error, "always", 10])).toBe(10);
	expect(getMinLength([RuleConfigSeverity.Warning, "never"])).toBe(0);
	expect(getMinLength([RuleConfigSeverity.Disabled, "always"])).toBe(0);
	expect(getMinLength([RuleConfigSeverity.Error] as any)).toBe(0);

	const rules: any = {
		"body-min-length": [RuleConfigSeverity.Error, "always", 10],
		"footer-min-length": [RuleConfigSeverity.Error, "always", 20],
		"test-min-length": [RuleConfigSeverity.Disabled, "always", 100],
	};
	let lengthRule = rules["header-min-length"];
	expect(getMinLength(lengthRule)).toBe(0);

	lengthRule = rules["body-min-length"];
	expect(getMinLength(lengthRule)).toBe(10);

	lengthRule = rules["test-min-length"];
	expect(getMinLength(lengthRule)).toBe(0);
});

test("enumRuleIsActive", () => {
	const rules: any = {
		"enum-string": [RuleConfigSeverity.Warning, "always", ["1", "2", "3"]],
		"type-enum": [RuleConfigSeverity.Error, "always", ["build", "chore", "ci"]],
		"scope-enum": [RuleConfigSeverity.Error, "never", ["cli", "core", "lint"]],
		"bar-enum": [RuleConfigSeverity.Disabled, "always", ["foo", "bar", "baz"]],
	};

	expect(enumRuleIsActive(rules["type-enum"])).toBe(true);
	expect(enumRuleIsActive(rules["string-enum"])).toBe(false);
	expect(enumRuleIsActive(rules["enum-string"])).toBe(true);
	expect(enumRuleIsActive(rules["bar-enum"])).toBe(false);
	expect(enumRuleIsActive(rules["scope-enum"])).toBe(false);
});

test("getEnumList", () => {
	const rules: any = {
		"type-enum": [RuleConfigSeverity.Error, "always", ["build", "chore", "ci"]],
		"scope-enum": [RuleConfigSeverity.Error, "never", ""],
		"bar-enum": [RuleConfigSeverity.Disabled, "always"],
	};

	expect(getEnumList(rules["type-enum"])).toEqual(["build", "chore", "ci"]);
	expect(getEnumList(rules["scope-enum"])).toEqual([]);
	expect(getEnumList(rules["bar-enum"])).toEqual([]);
});
