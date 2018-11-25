import * as _ from 'lodash';

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
			return input => _.camelCase(input);
		case 'kebab-case':
			return input => _.kebabCase(input);
		case 'snake-case':
			return input => _.snakeCase(input);
		case 'pascal-case':
			return input => _.upperFirst(_.camelCase(input));
		case 'start-case':
			return input => _.startCase(input);
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
