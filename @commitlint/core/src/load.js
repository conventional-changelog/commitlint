import path from 'path';
import {entries, merge, mergeWith, pick} from 'lodash';
import rc from 'rc';

import resolveExtends from './library/resolve-extends';
import executeRule from './library/execute-rule';

const w = (a, b) => Array.isArray(b) ? b : undefined;
const valid = input => pick(input, 'extends', 'rules');

export default async (seed = {}) => {
	// Obtain config from .rc files
	const raw = file();
	const found = typeof raw.config === 'string';

	// Use the default extends config if there is no userConfig file found
	// See https://git.io/vwT1C for reference
	const applicable = found ? {} : {extends: []};

	// Merge passed config with file based options
	const config = valid(merge(raw, seed));
	const opts = merge({}, applicable, pick(config, 'extends'));

	// Resolve extends key
	const extended = resolveExtends(opts, {
		prefix: 'commitlint-config',
		cwd: found ? path.dirname(raw.config) : undefined
	});

	const preset = valid(mergeWith({}, extended, config, w));

	// Execute rule config functions if needed
	const executed = await Promise.all(['rules']
		.map(key => {
			return [key, preset[key]];
		})
		.map(async item => {
			const [key, value] = item;
			const executedValue = await Promise.all(
				entries(value || {})
					.map(entry => executeRule(entry))
			);
			return [key, executedValue.reduce((registry, item) => {
				const [key, value] = item;
				return {
					...registry,
					[key]: value
				};
			}, {})];
		}));

	// Merge executed config keys into preset
	return executed.reduce((registry, item) => {
		const [key, value] = item;
		return {
			...registry,
			[key]: value
		};
	}, preset);
};

function file() {
	const legacy = rc('conventional-changelog-lint');
	const legacyFound = typeof legacy.config === 'string';

	const raw = rc('commitlint');
	const rawFound = typeof raw.config === 'string';

	if (legacyFound && !rawFound) {
		console.warn(`Using legacy ${path.relative(process.cwd(), legacy.config)}. Rename to .commitlintrc to silence this warning.`);
	}

	if (legacyFound && rawFound) {
		console.warn(`Ignored legacy ${path.relative(process.cwd(), legacy.config)} as ${path.relative(process.cwd(), raw.config)} superseeds it. Remove .conventional-changelog-lintrc to silence this warning.`);
	}

	if (rawFound) {
		return raw;
	}

	return legacy;
}
