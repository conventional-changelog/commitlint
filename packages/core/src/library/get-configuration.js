import {omit, merge, mergeWith, pick} from 'lodash';
import rc from 'rc';

import resolveExtends from './resolve-extends';
import executeRule from './execute-rule';

const defaults = {
	extends: []
};

const defaultName = 'commitlint';

const defaultSettings = {
	prefix: 'commitlint-config'
};

export default async (name = defaultName, settings = defaultSettings, seed = {}) => {
	// Obtain config from .rc files
	const userConfig = omit(rc(name, settings.defaults), '_');

	// Use the default extends config if there is no userConfig file found
	// See https://git.io/vwT1C for reference
	const applicableDefaults = userConfig.config ? {} : defaults;

	// Merge passed config with file based options
	const config = merge(userConfig, seed);
	const opts = merge({}, applicableDefaults, pick(config, 'extends'));

	// Resolve extends key
	const extended = resolveExtends(opts, settings.prefix);
	const preset = mergeWith({}, extended, config, (a, b) => {
		if (Array.isArray(b)) {
			return b;
		}
	});

	// Execute rule config functions if needed
	const executed = await Promise.all(['rules', 'wildcards']
		.map(key => {
			return [key, preset[key]];
		})
		.map(async item => {
			const [key, value] = item;
			const executedValue = await Promise.all(
				Object.entries(value || {})
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
