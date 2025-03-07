import { test, expect } from "vitest";
import {
	RuleConfigQuality,
	RuleConfigSeverity,
	RulesConfig,
} from "@commitlint/types";

import {
	enumRuleIsActive,
	getHasName,
	getMaxLength,
	getRuleName,
	getRulePrefix,
	getRules,
	ruleIsActive,
} from "./utils.js";

test("getRulePrefix", () => {
	expect(getRulePrefix("body-leading-blank")).toEqual("body");
	expect(getRulePrefix("body-max-line-length")).toEqual("body");
	expect(getRulePrefix("footer-leading-blank")).toEqual("footer");
	expect(getRulePrefix("footer-max-line-length")).toEqual("footer");
	expect(getRulePrefix("header-max-length")).toEqual("header");
	expect(getRulePrefix("scope-case")).toEqual("scope");
	expect(getRulePrefix("scope-enum")).toEqual("scope");
	expect(getRulePrefix("subject-case")).toEqual("subject");
	expect(getRulePrefix("subject-empty")).toEqual("subject");
	expect(getRulePrefix("subject-full-stop")).toEqual("subject");
	expect(getRulePrefix("type-case")).toEqual("type");
	expect(getRulePrefix("type-empty")).toEqual("type");
	expect(getRulePrefix("type-enum")).toEqual("type");
});

test("getRuleName", () => {
	expect(getRuleName("body-leading-blank")).toEqual("leading-blank");
	expect(getRuleName("body-max-line-length")).toEqual("max-line-length");
	expect(getRuleName("footer-leading-blank")).toEqual("leading-blank");
	expect(getRuleName("footer-max-line-length")).toEqual("max-line-length");
	expect(getRuleName("header-max-length")).toEqual("max-length");
	expect(getRuleName("scope-case")).toEqual("case");
	expect(getRuleName("scope-enum")).toEqual("enum");
	expect(getRuleName("subject-case")).toEqual("case");
	expect(getRuleName("subject-empty")).toEqual("empty");
	expect(getRuleName("subject-full-stop")).toEqual("full-stop");
	expect(getRuleName("type-case")).toEqual("case");
	expect(getRuleName("type-empty")).toEqual("empty");
	expect(getRuleName("type-enum")).toEqual("enum");
});

test("ruleIsActive", () => {
	expect(ruleIsActive(["", [RuleConfigSeverity.Error, "always", 100]])).toBe(
		true,
	);
	expect(ruleIsActive(["", [RuleConfigSeverity.Warning, "never", 100]])).toBe(
		true,
	);
	expect(ruleIsActive(["", [RuleConfigSeverity.Disabled, "always", 100]])).toBe(
		false,
	);
	expect(ruleIsActive(["", [RuleConfigSeverity.Error]] as any)).toBe(true);
});

test("getMaxLength", () => {
	expect(getMaxLength(["", [RuleConfigSeverity.Error, "always", 100]])).toBe(
		100,
	);
	expect(getMaxLength(["", [RuleConfigSeverity.Warning, "never", 100]])).toBe(
		Infinity,
	);
	expect(getMaxLength(["", [RuleConfigSeverity.Disabled, "always", 100]])).toBe(
		Infinity,
	);
	expect(getMaxLength(["", [RuleConfigSeverity.Error, 100]] as any)).toBe(
		Infinity,
	);

	const rules: any = {
		"body-max-line-length": [RuleConfigSeverity.Error, "always", 100],
		"header-max-length": [RuleConfigSeverity.Error, "always", 100],
		"test-max-length": [RuleConfigSeverity.Disabled, "always", 100],
	};
	let lengthRule = getRules("header", rules).find(getHasName("max-length"));
	expect(getMaxLength(lengthRule)).toBe(100);

	lengthRule = getRules("body", rules).find(getHasName("max-length"));
	expect(getMaxLength(lengthRule)).toBe(Infinity);

	lengthRule = getRules("test", rules).find(getHasName("max-length"));
	expect(getMaxLength(lengthRule)).toBe(Infinity);
});

test("check enum rule filters", () => {
	const rules: Partial<RulesConfig<RuleConfigQuality.Qualified>> = {
		"enum-string": [RuleConfigSeverity.Warning, "always", ["1", "2", "3"]],
		"type-enum": [RuleConfigSeverity.Error, "always", ["build", "chore", "ci"]],
		"scope-enum": [RuleConfigSeverity.Error, "never", ["cli", "core", "lint"]],
		"bar-enum": [RuleConfigSeverity.Disabled, "always", ["foo", "bar", "baz"]],
	};

	let enumRule = getRules("type", rules)
		.filter(getHasName("enum"))
		.find(enumRuleIsActive);
	expect(enumRule).toEqual([
		"type-enum",
		[RuleConfigSeverity.Error, "always", ["build", "chore", "ci"]],
	]);

	enumRule = getRules("string", rules)
		.filter(getHasName("enum"))
		.find(enumRuleIsActive);
	expect(enumRule).toEqual(undefined);

	enumRule = getRules("enum", rules)
		.filter(getHasName("string"))
		.find(enumRuleIsActive);
	expect(enumRule).toEqual([
		"enum-string",
		[RuleConfigSeverity.Warning, "always", ["1", "2", "3"]],
	]);

	enumRule = getRules("bar", rules)
		.filter(getHasName("enum"))
		.find(enumRuleIsActive);
	expect(enumRule).toEqual(undefined);

	enumRule = getRules("scope", rules)
		.filter(getHasName("enum"))
		.find(enumRuleIsActive);
	expect(enumRule).toEqual(undefined);
});
