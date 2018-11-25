import util from 'util';
import isIgnored from '@commitlint/is-ignored';
import parse from '@commitlint/parse';
import implementations from '@commitlint/rules';
import {toPairs} from 'lodash';

const buildCommitMesage = ({header, body, footer}) => {
	let message = header;

	message = body ? `${message}\n\n${body}` : message;
	message = footer ? `${message}\n\n${footer}` : message;

	return message;
};

export default async (message, rules = {}, opts = {}) => {
	// Found a wildcard match, skip
	if (isIgnored(message)) {
		return {
			valid: true,
			errors: [],
			warnings: [],
			input: message
		};
	}

	// Parse the commit message
	const parsed = await parse(message, undefined, opts.parserOpts);

	// Find invalid rules configs
	const missing = Object.keys(rules).filter(
		name => typeof implementations[name] !== 'function'
	);

	if (missing.length > 0) {
		const names = Object.keys(implementations);
		throw new RangeError(
			`Found invalid rule names: ${missing.join(
				', '
			)}. Supported rule names are: ${names.join(', ')}`
		);
	}

	const invalid = toPairs(rules)
		.map(([name, config]) => {
			if (!Array.isArray(config)) {
				return new Error(
					`config for rule ${name} must be array, received ${util.inspect(
						config
					)} of type ${typeof config}`
				);
			}

			const [level, when] = config;

			if (typeof level !== 'number' || isNaN(level)) {
				return new Error(
					`level for rule ${name} must be number, received ${util.inspect(
						level
					)} of type ${typeof level}`
				);
			}

			if (level === 0 && config.length === 1) {
				return null;
			}

			if (config.length !== 2 && config.length !== 3) {
				return new Error(
					`config for rule ${name} must be 2 or 3 items long, received ${util.inspect(
						config
					)} of length ${config.length}`
				);
			}

			if (level < 0 || level > 2) {
				return new RangeError(
					`level for rule ${name} must be between 0 and 2, received ${util.inspect(
						level
					)}`
				);
			}

			if (typeof when !== 'string') {
				return new Error(
					`condition for rule ${name} must be string, received ${util.inspect(
						when
					)} of type ${typeof when}`
				);
			}

			if (when !== 'never' && when !== 'always') {
				return new Error(
					`condition for rule ${name} must be "always" or "never", received ${util.inspect(
						when
					)}`
				);
			}

			return null;
		})
		.filter(item => item instanceof Error);

	if (invalid.length > 0) {
		throw new Error(invalid.map(i => i.message).join('\n'));
	}

	// Validate against all rules
	const results = toPairs(rules)
		.filter(entry => {
			const [, [level]] = toPairs(entry);
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

	const errors = results.filter(result => result.level === 2 && !result.valid);
	const warnings = results.filter(
		result => result.level === 1 && !result.valid
	);

	const valid = errors.length === 0;

	return {
		valid,
		errors,
		warnings,
		input: buildCommitMesage(parsed)
	};
};
