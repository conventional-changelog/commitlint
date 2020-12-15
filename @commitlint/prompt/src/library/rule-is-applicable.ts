/**
 * Check if a rule definition is applicable
 * @param {object} rule to check
 * @return {boolean} if the rule definition is appliable
 */
import {RuleEntry} from './types';
import {RuleConfigSeverity} from '@commitlint/types';

export default function ruleIsApplicable(
	rule: RuleEntry
): rule is
	| [string, Readonly<[RuleConfigSeverity, 'always']>]
	| [string, Readonly<[RuleConfigSeverity, 'always', unknown]>] {
	const [, value] = rule;
	if (value) {
		return value[1] === 'always';
	}
	return false;
}
