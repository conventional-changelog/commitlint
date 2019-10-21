import path from 'path';
import executeRule from '@commitlint/execute-rule';
import resolveExtends from '@commitlint/resolve-extends';
import cosmiconfig from 'cosmiconfig';
import {toPairs, merge, mergeWith, pick, startsWith} from 'lodash';
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

	// Resolve parserPreset key when overwritten by main config
	if (typeof config.parserPreset === 'string') {
		const resolvedParserPreset = resolveFrom(base, config.parserPreset);

		config.parserPreset = {
			name: config.parserPreset,
			path: resolvedParserPreset,
			parserOpts: require(resolvedParserPreset)
		};
	}

	// Resolve extends key
	const extended = resolveExtends(opts, {
		prefix: 'commitlint-config',
		cwd: base,
		parserPreset: config.parserPreset
	});

	const preset = valid(mergeWith(extended, config, w));

	// Resolve parser-opts from preset
	if (typeof preset.parserPreset === 'object') {
		preset.parserPreset.parserOpts = await loadParserOpts(
			preset.parserPreset.name,
			preset.parserPreset
		);
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

async function loadParserOpts(parserName, pendingParser) {
	// Await for the module, loaded with require
	const parser = await pendingParser;

	// Await parser opts if applicable
	if (
		typeof parser === 'object' &&
		typeof parser.parserOpts === 'object' &&
		typeof parser.parserOpts.then === 'function'
	) {
		return (await parser.parserOpts).parserOpts;
	}

	// Create parser opts from factory
	if (
		typeof parser === 'object' &&
		typeof parser.parserOpts === 'function' &&
		startsWith(parserName, 'conventional-changelog-')
	) {
		return await new Promise(resolve => {
			parser.parserOpts((_, opts) => {
				resolve(opts.parserOpts);
			});
		});
	}

	// Pull nested paserOpts, might happen if overwritten with a module in main config
	if (
		typeof parser === 'object' &&
		typeof parser.parserOpts === 'object' &&
		typeof parser.parserOpts.parserOpts === 'object'
	) {
		return parser.parserOpts.parserOpts;
	}

	return parser.parserOpts;
}
