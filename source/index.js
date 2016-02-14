import {sync as parse} from 'conventional-commits-parser';

export default (message, options = {}) => {
	const {
		preset: {
			parserOpts: parserOptions
		},
		configuration: {
			rules,
			wildcards
		}
	} = options;

	const parsed = parse(message, parserOptions);

	// wildcard matches skip the linting
	const bails = Object.entries(wildcards || {})
		.filter(entry => {
			const [, pattern] = entry;
			return Array.isArray(pattern);
		})
		.filter(entry => {
			const [, pattern] = entry;
			const expression = new RegExp(...pattern);
			return parsed.header.match(expression);
		})
		.map(entry => entry[0]);

	if (bails.length > 0) {
		return {
			valid: true,
			wildcards: bails,
			rules: [],
			warnings: [],
			errors: []
		};
	}

	// validate against all rules
	const results = Object.entries(rules || {})
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
		.filter(Boolean);

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
