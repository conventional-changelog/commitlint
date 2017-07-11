import getForcedCase from './get-forced-case';

/**
 * Get forced case for rule
 * @param {object} rule to parse
 * @return {fn} transform function applying the enforced case
 */
export default function getForcedCaseFn(rule) {
	const noop = input => input;
	const lowerCase = input => String.prototype.toLowerCase.call(input);
	const upperCase = input => String.prototype.toUpperCase.call(input);

	if (!rule) {
		return noop;
	}

	const forcedCase = getForcedCase(rule);

	if (forcedCase === null) {
		return noop;
	}

	return forcedCase === 'lowerCase' ? lowerCase : upperCase;
}
