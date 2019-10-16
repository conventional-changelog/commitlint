import path from 'path';
import executeRule from '@commitlint/execute-rule';
import resolveExtends from '@commitlint/resolve-extends';
import cosmiconfig from 'cosmiconfig';
import {toPairs, merge, mergeWith, pick} from 'lodash';
import resolveFrom from 'resolve-from';
import loadPlugin from './utils/loadPlugin';

const w = (a, b) => (Array.isArray(b) ? b : undefined);
const valid = input =>
	pick(
		input,
		'extends',
		'rules',
		'plugins',
		'parserPreset',
		'formatter',
		'ignores',
		'defaultIgnores'
	);

export default async (seed = {}, options = {cwd: process.cwd()}) => {
	const loaded = await loadConfig(options.cwd, options.file);
	const base = loaded.filepath ? path.dirname(loaded.filepath) : options.cwd;

	// Merge passed config with file based options
	const config = valid(merge({}, loaded.config, seed));
	const opts = merge(
		{extends: [], rules: {}, formatter: '@commitlint/format'},
		pick(config, 'extends', 'plugins', 'ignores', 'defaultIgnores')
	);

	// Resolve parserPreset key from flat-non-extended config
	if (typeof config.parserPreset === 'string') {
		const resolvedParserPreset = resolveFrom(base, config.parserPreset);
		let resolvedParserConfig = await require(resolvedParserPreset);

		// Resolve loaded parser preset factory
		if (typeof resolvedParserConfig === 'function') {
			resolvedParserConfig = await resolvedParserConfig();
		}

		config.parserPreset = {
			name: config.parserPreset,
			path: resolvedParserPreset,
			parserOpts: resolvedParserConfig.parserOpts
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
		let parserPreset = await preset.parserPreset.parserOpts;

		// Resolve loaded parser preset factory from extended config
		if (typeof parserPreset === 'function') {
			parserPreset = await parserPreset();
		}

		preset.parserPreset.parserOpts = parserPreset.parserOpts;
	}

	// Resolve config-relative formatter module
	if (typeof config.formatter === 'string') {
		preset.formatter =
			resolveFrom.silent(base, config.formatter) || config.formatter;
	}

	// resolve plugins
	preset.plugins = {};
	if (config.plugins && config.plugins.length) {
		config.plugins.forEach(pluginKey => {
			loadPlugin(preset.plugins, pluginKey, process.env.DEBUG === 'true');
		});
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
					toPairs(value || {}).map(entry => executeRule(entry))
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
	const explorer = cosmiconfig('commitlint');

	const explicitPath = configPath ? path.resolve(cwd, configPath) : undefined;
	const explore = explicitPath ? explorer.load : explorer.search;
	const searchPath = explicitPath ? explicitPath : cwd;
	const local = await explore(searchPath);

	if (local) {
		return local;
	}

	return {};
}
