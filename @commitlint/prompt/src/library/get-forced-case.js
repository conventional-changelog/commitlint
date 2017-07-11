/**
 * Get forced case for rule
 * @param {object} rule to parse
 * @return {string|null} transform function applying the enforced case
 */
export default function getForcedCase(rule) {
	if (!rule) {
		return null;
	}

	const [, [severity, applicable, value]] = rule;
	const negated = applicable === 'never';

	if (severity === 0) {
		return null;
	}

	if (negated) {
		return value === 'lowerCase' ? 'upperCase' : 'lowerCase';
	}

	return value === 'lowerCase' ? 'lowerCase' : 'upperCase';
}
