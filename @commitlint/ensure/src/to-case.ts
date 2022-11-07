import {TargetCaseType} from '@commitlint/types';
import camelCase from 'lodash.camelcase';
import kebabCase from 'lodash.kebabcase';
import snakeCase from 'lodash.snakecase';
import upperFirst from 'lodash.upperfirst';
import startCase from 'lodash.startcase';

export default function toCase(input: string, target: TargetCaseType): string {
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
			return upperFirst(input);
		case 'lower-case':
		case 'lowercase':
		case 'lowerCase': // Backwards compat config-angular v4
			return input.toLowerCase();
		default:
			throw new TypeError(`to-case: Unknown target case "${target}"`);
	}
}
