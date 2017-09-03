import {entries} from 'lodash';
import isIgnored from './library/is-ignored';
import parse from './library/parse';
import implementations from './rules';

export default async (message, rules = {}, opts = {}) => {
	// Found a wildcard match, skip
	if (isIgnored(message)) {
		return {
			valid: true,
			errors: [],
			warnings: []
		};
	}

	// Parse the commit message
	const parsed = await parse(message, undefined, opts.parserOpts);

	// Validate against all rules
	const results = entries(rules)
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

			const rule = implementations[name];
			const [valid, message] = rule(parsed, when, value);

			return {
				level,
				valid,
				name,
				message
			};
		})
		.filter(Boolean);

	const errors = results.filter(result => result.level > 1 && !result.valid);

	const warnings = results.filter(result => result.level < 2 && !result.valid);

	const valid = errors.length === 0;

	return {
		valid,
		errors,
		warnings
	};
};

