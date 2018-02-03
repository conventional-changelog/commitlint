import path from 'path';
import executeRule from '@commitlint/execute-rule';
import resolveExtends from '@commitlint/resolve-extends';
import cosmiconfig from 'cosmiconfig';
import entries from 'lodash.topairs';
import merge from 'lodash.merge';
import mergeWith from 'lodash.mergewith';
import pick from 'lodash.pick';
import resolveFrom from 'resolve-from';

const w = (a, b) => (Array.isArray(b) ? b : undefined);
const valid = input => pick(input, 'extends', 'rules', 'parserPreset');

export default async (seed = {}, options = {cwd: process.cwd()}) => {
	const loaded = await loadConfig(options.cwd, options.file);
	const base = loaded.filepath ? path.dirname(loaded.filepath) : options.cwd;

	// Merge passed config with file based options
	const config = valid(merge(loaded.config, seed));
	const opts = merge({extends: [], rules: {}}, pick(config, 'extends'));

	// Resolve parserPreset key
	if (typeof config.parserPreset === 'string') {
		const resolvedParserPreset = resolveFrom(base, config.parserPreset);

		config.parserPreset = {
			name: config.parserPreset,
			path: resolvedParserPreset,
			parserOpts: (await require(resolvedParserPreset)).parserOpts
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
		typeof preset.parserPreset.parserOpts === 'object' &&
		typeof preset.parserPreset.parserOpts.then === 'function'
	) {
		preset.parserPreset.parserOpts = (await preset.parserPreset
			.parserOpts).parserOpts;
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

async function loadConfig(cwd, configPath) {
	const explorer = cosmiconfig('commitlint', {
		rcExtensions: true,
		configPath: configPath ? path.resolve(cwd, configPath) : null
	});

	const local = await explorer.load(cwd);

	if (local) {
		return local;
	}

	return {};
}
