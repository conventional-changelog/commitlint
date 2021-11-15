import {Rule} from '../types';
import {ruleIsActive, ruleIsNotApplicable} from './rules';

/**
 * Get forced leading for rule
 * @param rule to parse
 * @return transform function applying the leading
 */
export default function getLeadingBlankFn(
	rule?: Rule
): (input: string) => string {
	if (!rule || !ruleIsActive(rule)) {
		return (input: string): string => input;
	}

	const remove = (input: string): string => {
		const fragments = input.split('\n');
		while (fragments.length > 0 && fragments[0] === '') {
			fragments.shift();
		}
		return fragments.join('\n');
	};
	const lead = (input: string): string => {
		const fragments = input.split('\n');
		return fragments[0] === '' ? input : ['', ...fragments].join('\n');
	};

	return !ruleIsNotApplicable(rule) ? lead : remove;
}
