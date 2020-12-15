import {RuleEntry} from './types';

/**
 * Get forced leading for rule
 * @param {object} rule to parse
 * @return transform function applying the leading
 */
export default function getForcedLeadingFn(
	rule?: RuleEntry
): (input: string) => string {
	const noop = (input: string): string => input;
	const remove = (input: string): string => {
		const fragments = input.split('\n');
		return fragments[0] === '' ? fragments.slice(1).join('\n') : input;
	};
	const lead = (input: string): string => {
		const fragments = input.split('\n');
		return fragments[0] === '' ? input : ['', ...fragments].join('\n');
	};

	if (!rule) {
		return noop;
	}

	const leading = getForcedLeading(rule);

	if (leading === null) {
		return noop;
	}

	return leading ? lead : remove;
}

/**
 * Get forced leading for rule
 * @param {object} rule to parse
 * @return {boolean|null} transform function applying the leading
 */
function getForcedLeading(rule: RuleEntry) {
	if (!rule) {
		return null;
	}

	const [, [severity, applicable]] = rule;
	const negated = applicable === 'never';

	if (severity === 0) {
		return null;
	}

	return !negated;
}
