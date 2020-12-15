import {RuleEntry} from './types';
import {RuleConfigSeverity} from '@commitlint/types';

/**
 * Check if a rule definition is applicable
 * @param rule to check
 * @return if the rule definition is applicable
 */
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
