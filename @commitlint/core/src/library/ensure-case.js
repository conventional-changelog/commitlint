import {camelCase, kebabCase, snakeCase, upperFirst, startCase} from 'lodash';

export default ensureCase;

function ensureCase(raw = '', target = 'lowercase') {
	const input = String(raw);

	switch (target) {
		case 'camel-case':
			return camelCase(input) === input;
		case 'kebab-case':
			return kebabCase(input) === input;
		case 'snake-case':
			return snakeCase(input) === input;
		case 'pascal-case':
			return upperFirst(camelCase(input)) === input;
		case 'start-case':
			return startCase(input) === input;
		case 'upper-case':
		case 'uppercase':
			return input.toUpperCase() === input;
		case 'sentence-case':
		case 'sentencecase':
			return (
				ensureCase(raw.charAt(0), 'upper-case') &&
				ensureCase(raw.substring(1), 'lower-case')
			);
		case 'lower-case':
		case 'lowercase':
			return input.toLowerCase() === input;
		default:
			throw new TypeError(`ensure-case: Unknown target case "${target}"`);
	}
}
