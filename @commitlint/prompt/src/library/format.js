import chalk from 'chalk';
import {entries} from 'lodash';

export default format;

/**
 * Get formatted commit message
 * @param  {object}  input object containing structured results
 * @param  {boolean} debug show debug information in commit message
 * @return {string}        formatted debug message
 */
function format(input, debug = false) {
	const results = debug
		? entries(input).reduce((registry, item) => {
				const [name, value] = item;
				registry[name] = value === null ? chalk.grey(`<${name}>`) : chalk.bold(value)
				return registry;
			}, {})
		: input;

	// Return formatted string
	const {type, scope, subject, body, footer} = results;
	return [
		`${type}${scope ? '(' : ''}${scope}${scope ? ')' : ''}${type || scope
			? ':'
			: ''} ${subject}`,
		body,
		footer
	]
		.filter(Boolean)
		.join('\n');
}
