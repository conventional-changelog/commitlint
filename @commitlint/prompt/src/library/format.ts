import chalk from 'chalk';

import type {Result, ResultPart} from './types.js';

/**
 * Get formatted commit message
 * @param input object containing structured results
 * @param debug show debug information in commit message
 * @return formatted debug message
 */
export default function format(input: Result, debug = false): string {
	const defaultInput = {
		type: undefined,
		scope: undefined,
		subject: undefined,
		body: undefined,
		footer: undefined,
		...input,
	};
	const results = debug
		? Object.entries(defaultInput).reduce<Result>((registry, [name, value]) => {
				registry[name as ResultPart] =
					value === undefined ? chalk.grey(`<${name}>`) : chalk.bold(value);
				return registry;
		  }, {})
		: defaultInput;

	// Return formatted string
	const {type, scope, subject, body, footer} = results;
	return [
		`${type || ''}${scope ? `(${scope})` : ''}${type || scope ? ':' : ''} ${
			subject || ''
		}`,
		body,
		footer,
	]
		.filter(Boolean)
		.join('\n');
}
