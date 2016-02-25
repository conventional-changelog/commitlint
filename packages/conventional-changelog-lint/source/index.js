import {sync as parse} from 'conventional-commits-parser';
import {merge} from 'lodash';

export getConfiguration from './library/get-configuration';
export getMessages from './library/get-messages';
export getPreset from './library/get-preset';
export format from './library/format';

async function executeRule(entry) {
	const [name, config] = entry;
	return typeof config === 'function' ?
		[name, await config()] :
		[name, await config];
}

export default async (message, options = {}) => {
	const {
		preset: {
			parserOpts: parserOptions
		},
		configuration: {
			rules,
			wildcards
		}
	} = options;

	const parsed = merge(
		{raw: message},
		parse(message, parserOptions)
	);

	// execute wildcard rules
	const executedWildcards = await Promise.all(
		Object.entries(wildcards || {})
			.map(async entry => await executeRule(entry))
	);

	// wildcard matches skip the linting
	const bails = executedWildcards
		.filter(entry => {
			const [, pattern] = entry;
			return Array.isArray(pattern);
		})
		.filter(entry => {
			const [, pattern] = entry;
			const expression = new RegExp(...pattern);
			return parsed.header.match(expression);
		})
		.map(entry => entry[0])

	if (bails.length > 0) {
		return {
			valid: true,
			wildcards: bails,
			rules: [],
			warnings: [],
			errors: []
		};
	}

	// execute linting rules
	const executedRules = await Promise.all(
		Object.entries(rules || {})
			.map(async entry => await executeRule(entry))
		);

		// validate against all rules
	const results = executedRules
		.filter(entry => {
			const [, [level]] = entry;
			return level > 0;
		})
		.map(entry => {
			const [name, config] = entry;
			const [level, when, value] = config;

			// Level 0 rules are ignored
			if (level === 0) {
				return null;
			}

			const rule = require(`./rules/${name}`);
			const [valid, message] = rule(parsed, when, value);

			return {
				level,
				valid,
				name,
				message
			};
		})
		.filter(Boolean)

	const errors = results.filter(result =>
		result.level > 1 && !result.valid);

	const warnings = results.filter(result =>
		result.level < 2 && !result.valid);

	const valid = errors.length === 0;

	return {
		valid,
		errors,
		warnings
	};
};
