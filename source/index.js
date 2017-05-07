import ruleFunctions from './rules';
import format from './library/format';
import getConfiguration from './library/get-configuration';
import getMessages from './library/get-messages';
import getPreset from './library/get-preset';
import parse from './library/parse';

export {format, getConfiguration, getMessages, getPreset};

export default async (message, options = {}) => {
	const {
		configuration: {
			rules,
			wildcards
		}
	} = options;

	// Parse the commit message
	const parsed = parse(message);

	// Wildcard matches skip the linting
	const bails = Object.entries(wildcards)
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

	// Found a wildcard match, skip
	if (bails.length > 0) {
		return {
			valid: true,
			wildcards: bails,
			rules: [],
			warnings: [],
			errors: []
		};
	}

	// Validate against all rules
	const results = Object.entries(rules)
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

			const rule = ruleFunctions[name];
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
