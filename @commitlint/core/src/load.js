import path from 'path';
import cosmiconfig from 'cosmiconfig';
import {entries, merge, mergeWith, pick} from 'lodash';
import resolveFrom from 'resolve-from';

import executeRule from './library/execute-rule';
import resolveExtends from './library/resolve-extends';
import toplevel from './library/toplevel';

const w = (a, b) => (Array.isArray(b) ? b : undefined);
const valid = input => pick(input, 'extends', 'rules', 'parserPreset');

export default async (seed = {}, options = {cwd: ''}) => {
	const explorer = cosmiconfig('commitlint', {
		rcExtensions: true,
		stopDir: await toplevel(options.cwd)
	});

	const raw = (await explorer.load(options.cwd)) || {};
	const base = raw.filepath ? path.dirname(raw.filepath) : options.cwd;

	// Merge passed config with file based options
	const config = valid(merge(raw.config, seed));
	const opts = merge({extends: [], rules: {}}, pick(config, 'extends'));

	// Resolve parserPreset key
	if (typeof config.parserPreset === 'string') {
		const resolvedParserPreset = resolveFrom(base, config.parserPreset);

		config.parserPreset = {
			name: config.parserPreset,
			path: resolvedParserPreset,
			opts: require(resolvedParserPreset)
		};
	}

	// Resolve extends key
	const extended = resolveExtends(opts, {
		prefix: 'commitlint-config',
		cwd: base,
		parserPreset: config.parserPreset
	});

	const preset = valid(mergeWith(extended, config, w));

	// Await parser-preset if applicable
	if (
		typeof preset.parserPreset === 'object' &&
		typeof preset.parserPreset.opts === 'object'
	) {
		preset.parserPreset.opts = await preset.parserPreset.opts;
	}

	// Execute rule config functions if needed
	const executed = await Promise.all(
		['rules']
			.map(key => {
				return [key, preset[key]];
			})
			.map(async item => {
				const [key, value] = item;
				const executedValue = await Promise.all(
					entries(value || {}).map(entry => executeRule(entry))
				);
				return [
					key,
					executedValue.reduce((registry, item) => {
						const [key, value] = item;
						registry[key] = value;
						return registry;
					}, {})
				];
			})
	);

	// Merge executed config keys into preset
	return executed.reduce((registry, item) => {
		const [key, value] = item;
		registry[key] = value;
		return registry;
	}, preset);
};
