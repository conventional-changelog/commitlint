import _ from 'lodash';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import snakeCase from 'lodash/snakeCase';
import startCase from 'lodash/startCase';
import upperFirst from 'lodash/upperFirst';
import {ruleIsActive, ruleIsNotApplicable} from './rules';
import {TargetCaseType} from '@commitlint/types';
import {case as ensureCase} from '@commitlint/ensure';
import {Rule} from '../types';

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

function toCase(input: string, target: TargetCaseType): string {
	switch (target) {
		case 'camel-case':
			return camelCase(input);
		case 'kebab-case':
			return kebabCase(input);
		case 'snake-case':
			return snakeCase(input);
		case 'pascal-case':
			return upperFirst(camelCase(input));
		case 'start-case':
			return startCase(input);
		case 'upper-case':
		case 'uppercase':
			return input.toUpperCase();
		case 'sentence-case':
		case 'sentencecase':
			return input.charAt(0).toUpperCase() + input.slice(1);
		case 'lower-case':
		case 'lowercase':
		case 'lowerCase': // Backwards compat config-angular v4
			return input.toLowerCase();
		default:
			throw new TypeError(`Unknown target case "${target}"`);
	}
}
