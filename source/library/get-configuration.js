import {merge, pick} from 'lodash';
import rc from 'rc';

import resolveExtends from './resolve-extends';
import executeRule from './execute-rule';

const defaults = {
	extends: ['angular']
};

const defaultName = 'conventional-changelog-lint';

const defaultSettings = {
	prefix: 'conventional-changelog-lint-config'
};

export default async (name = defaultName, settings = defaultSettings, seed = {}) => {
	// Merge passed config with file based options
	const config = merge(rc(name, settings.defaults), seed);
	const opts = merge({}, defaults, pick(config, 'extends'));

	// Resolve extends key
	const extended = resolveExtends(opts, settings.prefix);
	const preset = merge({}, extended, config);

	// Execute rule config functions if needed
	const executed = await Promise.all(['rules', 'wildcards']
		.map(key => {
			return [key, preset[key]];
		})
		.map(async item => {
			const [key, value] = item;
			const executedValue = await Promise.all(
				Object.entries(value || {})
					.map(async entry => await executeRule(entry))
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
