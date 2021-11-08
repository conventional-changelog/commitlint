import {toCase} from '@commitlint/ensure';
import {ruleIsActive, ruleIsNotApplicable} from './utils';
import type {RuleEntry} from './types';
import type {TargetCaseType} from '@commitlint/types';

/**
 * Get forced case for rule
 * @param rule to parse
 * @return transform function applying the enforced case
 */
export default function getForcedCaseFn(
	rule?: RuleEntry
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
