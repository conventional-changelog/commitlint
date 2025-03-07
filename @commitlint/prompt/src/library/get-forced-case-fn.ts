import {toCase} from '@commitlint/ensure';
import type {TargetCaseType} from '@commitlint/types';

import type {RuleEntry} from './types.js';
import {ruleIsActive, ruleIsNotApplicable} from './utils.js';

/**
 * Get forced case for rule
 * @param rule to parse
 * @return transform function applying the enforced case
 */
export default function getForcedCaseFn(
	rule?: RuleEntry,
): (input: string) => string {
	const noop = (input: string) => input;

	if (!rule || !ruleIsActive(rule) || ruleIsNotApplicable(rule)) {
		return noop;
	}

	const target = rule[1][2];

	if (Array.isArray(target)) {
		return noop;
	}

	return (input: string) => toCase(input, target as TargetCaseType);
}
