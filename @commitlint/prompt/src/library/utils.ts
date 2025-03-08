import { RuleConfigSeverity } from "@commitlint/types";
import type { QualifiedRules } from "@commitlint/types";

import type { RuleEntry } from "./types.js";

/**
 * Get name for a given rule id
 * @param id of the rule
 * @return name of the rule
 */
export function getRuleName(id: string): string {
	const fragments = id.split("-");
	return fragments.length > 1 ? fragments.slice(1).join("-") : fragments[0];
}

/**
 * Get prefix for a given rule id
 * @param id of the rule
 * @return prefix of the rule
 */
export function getRulePrefix(id: string): string | null {
	const fragments = id.split("-");
	return fragments.length > 1 ? fragments[0] : null;
}

/**
 * Get a predicate matching rule definitions with a given name
 */
export function getHasName(name: string) {
	return <T extends RuleEntry>(
		rule: RuleEntry,
	): rule is Exclude<T, [string, undefined]> => getRuleName(rule[0]) === name;
}

/**
 * Check if a rule definition is active
 * @param rule to check
 * @return if the rule definition is active
 */
export function ruleIsActive<T extends RuleEntry>(
	rule: T,
): rule is Exclude<T, [string, Readonly<[RuleConfigSeverity.Disabled]>]> {
	const [, value] = rule;
	if (value && Array.isArray(value)) {
		return value[0] > RuleConfigSeverity.Disabled;
	}
	return false;
}

/**
 * Check if a rule definition is applicable
 * @param rule to check
 * @return if the rule definition is applicable
 */
export function ruleIsApplicable(
	rule: RuleEntry,
): rule is
	| [string, Readonly<[RuleConfigSeverity, "always"]>]
	| [string, Readonly<[RuleConfigSeverity, "always", unknown]>] {
	const [, value] = rule;
	if (value && Array.isArray(value)) {
		return value[1] === "always";
	}
	return false;
}

/**
 * Check if a rule definition is applicable
 * @param rule to check
 * @return if the rule definition is applicable
 */
export function ruleIsNotApplicable(
	rule: RuleEntry,
): rule is
	| [string, Readonly<[RuleConfigSeverity, "never"]>]
	| [string, Readonly<[RuleConfigSeverity, "never", unknown]>] {
	const [, value] = rule;
	if (value && Array.isArray(value)) {
		return value[1] === "never";
	}
	return false;
}

export function enumRuleIsActive(
	rule: RuleEntry,
): rule is [
	string,
	Readonly<
		[RuleConfigSeverity.Warning | RuleConfigSeverity.Error, "always", string[]]
	>,
] {
	return (
		ruleIsActive(rule) &&
		ruleIsApplicable(rule) &&
		Array.isArray(rule[1][2]) &&
		rule[1][2].length > 0
	);
}

/**
 * Get rules for a given prefix
 * @param prefix to search in rule names
 * @param rules rules to search in
 * @return rules matching the prefix search
 */
export function getRules(prefix: string, rules: QualifiedRules): RuleEntry[] {
	return Object.entries(rules).filter(
		(rule): rule is RuleEntry => getRulePrefix(rule[0]) === prefix,
	);
}

export function getMaxLength(rule?: RuleEntry): number {
	if (
		rule &&
		ruleIsActive(rule) &&
		ruleIsApplicable(rule) &&
		typeof rule[1][2] === "number"
	) {
		return rule[1][2];
	}
	return Infinity;
}
