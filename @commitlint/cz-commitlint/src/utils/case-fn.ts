import {case as ensureCase, toCase} from '@commitlint/ensure';
import {TargetCaseType} from '@commitlint/types';

import {Rule} from '../types.js';
import {ruleIsActive, ruleIsNotApplicable} from './rules.js';

export type CaseFn = (input: string | string[], delimiter?: string) => string;

/**
 * Get forced case for rule
 * @param rule to parse
 * @return transform function applying the enforced case
 */
export default function getCaseFn(rule?: Rule): CaseFn {
	const noop = (input: string | string[], delimiter?: string) =>
		Array.isArray(input) ? input.join(delimiter) : input;

	if (!rule || !ruleIsActive(rule) || ruleIsNotApplicable(rule)) {
		return noop;
	}

	const value = rule[2];

	const caseList = Array.isArray(value) ? value : [value];

	return (input: string | string[], delimiter?: string) => {
		let matchedCase: TargetCaseType = caseList[0];
		const segments = Array.isArray(input) ? input : [input];

		for (const segment of segments) {
			const check = caseList.find((a) => ensureCase(segment, a));
			if (check) {
				matchedCase = check;
				break;
			}
		}

		return segments
			.map((segment) => {
				return toCase(segment, matchedCase);
			})
			.join(delimiter);
	};
}
