import * as _ from 'lodash';

export default ensureCase;

export type TargetCaseType =
	| 'camel-case'
	| 'kebab-case'
	| 'snake-case'
	| 'pascal-case'
	| 'start-case'
	| 'upper-case'
	| 'uppercase'
	| 'sentence-case'
	| 'sentencecase'
	| 'lower-case'
	| 'lowercase'
	| 'lowerCase';

function ensureCase(
	raw: string = '',
	target: TargetCaseType = 'lowercase'
): boolean {
	// We delete any content together with quotes because he can contains proper names (example `refactor: `Eslint` configuration`).
	// We need trim string because content with quotes can be at the beginning or end of a line
	const input = String(raw)
		.replace(/`.*?`|".*?"|'.*?'/g, '')
		.trim();

	const transformed = toCase(input, target);

	if (transformed === '' || transformed.match(/^\d/)) {
		return true;
	}

	return transformed === input;
}

function toCase(input: string, target: TargetCaseType): string {
	switch (target) {
		case 'camel-case':
			return _.camelCase(input);
		case 'kebab-case':
			return _.kebabCase(input);
		case 'snake-case':
			return _.snakeCase(input);
		case 'pascal-case':
			return _.upperFirst(_.camelCase(input));
		case 'start-case':
			return _.startCase(input);
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
			throw new TypeError(`ensure-case: Unknown target case "${target}"`);
	}
}
