import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import snakeCase from 'lodash/snakeCase';
import upperFirst from 'lodash/upperFirst';
import startCase from 'lodash/startCase';

/**
 * Get forced case for rule
 * @param {object} rule to parse
 * @return {fn} transform function applying the enforced case
 */
export default function getForcedCaseFn(rule) {
	const noop = input => input;

	if (!rule) {
		return noop;
	}

	const [config] = rule;

	if (!Array.isArray(config)) {
		return noop;
	}

	const [level] = config;

	if (level === 0) {
		return;
	}

	const [, when] = config;

	if (when === 'neve') {
		return;
	}

	const [, , target] = config;

	if (Array.isArray(target)) {
		return noop;
	}

	switch (target) {
		case 'camel-case':
			return input => camelCase(input);
		case 'kebab-case':
			return input => kebabCase(input);
		case 'snake-case':
			return input => snakeCase(input);
		case 'pascal-case':
			return input => upperFirst(camelCase(input));
		case 'start-case':
			return input => startCase(input);
		case 'upper-case':
		case 'uppercase':
			return input => input.toUpperCase();
		case 'sentence-case':
		case 'sentencecase':
			return input =>
				`${input.charAt(0).toUpperCase()}${input.substring(1).toLowerCase()}`;
		case 'lower-case':
		case 'lowercase':
		case 'lowerCase': // Backwards compat config-angular v4
			return input => input.toLowerCase() === input;
		default:
			throw new TypeError(`Unknown target case "${rule[2]}"`);
	}
}
