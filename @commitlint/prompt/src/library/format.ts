import chalk from 'chalk';
import {Result} from './types';

export default format;

/**
 * Get formatted commit message
 * @param  {object}  input object containing structured results
 * @param  {boolean} debug show debug information in commit message
 * @return {string}        formatted debug message
 */
function format(input: Result, debug = false): string {
	const results = debug
		? Object.entries(input).reduce<Result>(
				(registry, [name, value]) => {
					registry[name as 'type' | 'scope' | 'subject' | 'body' | 'footer'] =
						value === null ? chalk.grey(`<${name}>`) : chalk.bold(value);
					return registry;
				},
				{
					type: null,
					scope: null,
					subject: null,
					body: null,
					footer: null,
				}
		  )
		: input;

	// Return formatted string
	const {type, scope, subject, body, footer} = results;
	return [
		`${type}${scope ? '(' : ''}${scope}${scope ? ')' : ''}${
			type || scope ? ':' : ''
		} ${subject}`,
		body,
		footer,
	]
		.filter(Boolean)
		.join('\n');
}
