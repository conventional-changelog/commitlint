/**
 * Check if a rule definition is active
 * @param {object} rule to check
 * @return {boolean} if the rule definition is active
 */
export default function ruleIsActive(rule) {
	const [, [severity]] = rule;
	return severity > 0;
}
