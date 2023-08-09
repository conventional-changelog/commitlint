import executeRule from '@commitlint/execute-rule';
import resolveExtends from '@commitlint/resolve-extends';
import {validateConfig} from '@commitlint/config-validator';
import {
	LoadOptions,
	QualifiedConfig,
	QualifiedRules,
	PluginRecords,
	UserConfig,
} from '@commitlint/types';
import isPlainObject from 'lodash.isplainobject';
import merge from 'lodash.merge';
import uniq from 'lodash.uniq';
import Path from 'path';
import resolveFrom from 'resolve-from';
import {loadConfig} from './utils/load-config';
import {loadParserOpts} from './utils/load-parser-opts';
import loadPlugin from './utils/load-plugin';

export default async function load(
	seed: UserConfig = {},
	options: LoadOptions = {}
): Promise<QualifiedConfig> {
	const cwd = typeof options.cwd === 'undefined' ? process.cwd() : options.cwd;
	const loaded = await loadConfig(cwd, options.file);
	const base = loaded && loaded.filepath ? Path.dirname(loaded.filepath) : cwd;
	let config: UserConfig = {};
	if (loaded) {
		validateConfig(loaded.filepath || '', loaded.config);
		config = loaded.config;
	}

	// Merge passed config with file based options
	config = merge(
		{
			extends: [],
			plugins: [],
			rules: {},
		},
		config,
		seed
	);

	// Resolve parserPreset key
	if (typeof config.parserPreset === 'string') {
		const resolvedParserPreset = resolveFrom(base, config.parserPreset);

		config.parserPreset = {
			name: config.parserPreset,
			path: resolvedParserPreset,
			parserOpts: require(resolvedParserPreset),
		};
	}

	// Resolve extends key
	const extended = resolveExtends(config, {
		prefix: 'commitlint-config',
		cwd: base,
		parserPreset: config.parserPreset,
	});

	if (!extended.formatter || typeof extended.formatter !== 'string') {
		extended.formatter = '@commitlint/format';
	}

	let plugins: PluginRecords = {};
	if (Array.isArray(extended.plugins)) {
		uniq(extended.plugins || []).forEach((plugin) => {
			if (typeof plugin === 'string') {
				plugins = loadPlugin(plugins, plugin, process.env.DEBUG === 'true');
			} else {
				plugins.local = plugin;
			}
		});
	}

	const rules = (
		await Promise.all(
			Object.entries(extended.rules || {}).map((entry) => executeRule(entry))
		)
	).reduce<QualifiedRules>((registry, item) => {
		// type of `item` can be null, but Object.entries always returns key pair
		const [key, value] = item!;
		registry[key] = value;
		return registry;
	}, {});

	const helpUrl =
		typeof extended.helpUrl === 'string'
			? extended.helpUrl
			: typeof config.helpUrl === 'string'
			? config.helpUrl
			: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint';

	const prompt =
		extended.prompt && isPlainObject(extended.prompt) ? extended.prompt : {};

	return {
		extends: Array.isArray(extended.extends)
			? extended.extends
			: typeof extended.extends === 'string'
			? [extended.extends]
			: [],
		// Resolve config-relative formatter module
		formatter:
			resolveFrom.silent(base, extended.formatter) || extended.formatter,
		// Resolve parser-opts from preset
		parserPreset: await loadParserOpts(extended.parserPreset),
		ignores: extended.ignores,
		defaultIgnores: extended.defaultIgnores,
		plugins: plugins,
		rules: rules,
		helpUrl: helpUrl,
		prompt,
	};
}
