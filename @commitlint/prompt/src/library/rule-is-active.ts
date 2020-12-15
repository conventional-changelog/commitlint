import {RuleEntry} from './types';
import {RuleConfigSeverity} from '@commitlint/types';

/**
 * Check if a rule definition is active
 * @param rule to check
 * @return if the rule definition is active
 */
export default function ruleIsActive<T extends RuleEntry>(
	rule: T
): rule is Exclude<T, [string, Readonly<[RuleConfigSeverity.Disabled]>]> {
	const [, value] = rule;
	if (value) {
		return value[0] > RuleConfigSeverity.Disabled;
	}
	return false;
}
