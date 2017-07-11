import ruleIsApplicable from './rule-is-applicable';
import ruleIsActive from './rule-is-active';

/**
 * [enumRuleIsActive description]
 * @param  {[type]} rule [description]
 * @return {[type]}      [description]
 */
export default function enumRuleIsActive(rule) {
	const [, [, , value]] = rule;
	return ruleIsActive(rule) && ruleIsApplicable(rule) && value.length > 0;
}
