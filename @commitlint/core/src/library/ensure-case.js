import {camelCase, kebabCase, snakeCase, upperFirst, startCase} from 'lodash';

export default (raw = '', target = 'lowercase') => {
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
		case 'lower-case':
		case 'lowercase':
		default:
			return input.toLowerCase() === input;
	}
};
