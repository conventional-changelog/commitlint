import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import snakeCase from 'lodash/snakeCase';
import startCase from 'lodash/startCase';
import upperFirst from 'lodash/upperFirst';
import {Rule} from '../types';
import {ruleIsActive, ruleIsNotApplicable} from './rules';

export type CaseFn = (input: string) => string;

/**
 * Get forced case for rule
 * @param rule to parse
 * @return transform function applying the enforced case
 */
export default function getCaseFn(rule?: Rule): CaseFn {
	const noop = (input: string) => input;

	if (!rule || !ruleIsActive(rule) || ruleIsNotApplicable(rule)) {
		return noop;
	}

	const target = rule[2];

	if (Array.isArray(target)) {
		return noop;
	}

	switch (target) {
		case 'camel-case':
			return (input: string) => camelCase(input);
		case 'kebab-case':
			return (input: string) => kebabCase(input);
		case 'snake-case':
			return (input: string) => snakeCase(input);
		case 'pascal-case':
			return (input: string) => upperFirst(camelCase(input));
		case 'start-case':
			return (input: string) => startCase(input);
		case 'upper-case':
		case 'uppercase':
			return (input: string) => input.toUpperCase();
		case 'sentence-case':
		case 'sentencecase':
			return (input: string) =>
				`${input.charAt(0).toUpperCase()}${input.substring(1).toLowerCase()}`;
		case 'lower-case':
		case 'lowercase':
		case 'lowerCase': // Backwards compat config-angular v4
			return (input: string) => input.toLowerCase();
		default:
			throw new TypeError(`Unknown target case "${target}"`);
	}
}
