/**
 * Check if a rule definition is applicable
 * @param {object} rule to check
 * @return {boolean} if the rule definition is appliable
 */
export default function ruleIsApplicable(rule) {
	const [, [, applicable]] = rule;
	return applicable === 'always';
}
