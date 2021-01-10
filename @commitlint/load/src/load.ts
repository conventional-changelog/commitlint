import Path from 'path';

import merge from 'lodash/merge';
import uniq from 'lodash/uniq';
import resolveFrom from 'resolve-from';

import executeRule from '@commitlint/execute-rule';
import resolveExtends from '@commitlint/resolve-extends';
import {
	UserConfig,
	LoadOptions,
	QualifiedConfig,
	QualifiedRules,
	PluginRecords,
} from '@commitlint/types';

import loadPlugin from './utils/load-plugin';
import {loadConfig} from './utils/load-config';
import {loadParser} from './utils/load-parser-opts';
import {pickConfig} from './utils/pick-config';
import {validateConfig} from './utils/validators';

export default async function load(
	seed: UserConfig = {},
	options: LoadOptions = {}
): Promise<QualifiedConfig> {
	const cwd = typeof options.cwd === 'undefined' ? process.cwd() : options.cwd;
	const loaded = await loadConfig(cwd, options.file);
	const base = loaded && loaded.filepath ? Path.dirname(loaded.filepath) : cwd;

	// TODO: validate loaded.config against UserConfig type
	// Might amount to breaking changes, defer until 9.0.0

	// Merge passed config with file based options
	const config = pickConfig(
		merge(
			{
				extends: [],
				plugins: [],
				rules: {},
			},
			loaded ? loaded.config : null,
			seed
		)
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
	const extended = resolveExtends(config as any, {
		prefix: 'commitlint-config',
		cwd: base,
		parserPreset: config.parserPreset,
	});

	validateConfig(extended);

	if (!extended.formatter) {
		extended.formatter = '@commitlint/format';
	}

	if (!extended.helpUrl) {
		extended.helpUrl =
			'https://github.com/conventional-changelog/commitlint/#what-is-commitlint';
	}

	let plugins: PluginRecords = {};
	uniq(extended.plugins || []).forEach((plugin) => {
		if (typeof plugin === 'string') {
			plugins = loadPlugin(plugins, plugin, process.env.DEBUG === 'true');
		} else {
			plugins.local = plugin;
		}
	});

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

	return {
		// TODO: check if this is still necessary with the new factory based conventional changelog parsers
		// TODO: should this function return this? as those values are already resolved
		extends: Array.isArray(extended.extends)
			? extended.extends
			: typeof extended.extends === 'string'
			? [extended.extends]
			: [],
		// Resolve config-relative formatter module
		formatter:
			resolveFrom.silent(base, extended.formatter) || extended.formatter,
		// Resolve parser-opts from preset
		parserPreset: await loadParser(extended.parserPreset),
		ignores: extended.ignores,
		defaultIgnores: extended.defaultIgnores,
		plugins: plugins,
		rules: rules,
		helpUrl: extended.helpUrl,
	};
}
