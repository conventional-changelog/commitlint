import ruleIsApplicable from './rule-is-applicable';
import ruleIsActive from './rule-is-active';
import {RuleEntry} from './types';
import {RuleConfigSeverity} from '@commitlint/types';

/**
 * [enumRuleIsActive description]
 * @param  {[type]} rule [description]
 * @return {[type]}      [description]
 */
export default function enumRuleIsActive(
	rule: RuleEntry
): rule is [
	string,
	Readonly<
		[RuleConfigSeverity.Warning | RuleConfigSeverity.Error, 'always', string[]]
	>
] {
	return (
		ruleIsActive(rule) &&
		ruleIsApplicable(rule) &&
		Array.isArray(rule[1][2]) &&
		rule[1][2].length > 0
	);
}
