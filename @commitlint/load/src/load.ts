import Path from 'path';

import {toPairs, merge, mergeWith, pick} from 'lodash';
import resolveFrom from 'resolve-from';

import executeRule from '@commitlint/execute-rule';
import resolveExtends from '@commitlint/resolve-extends';

import loadPlugin from './utils/loadPlugin';
import {
	UserConfig,
	LoadOptions,
	QualifiedConfig,
	UserPreset,
	QualifiedRules,
	ParserPreset
} from './types';
import {loadConfig} from './utils/load-config';
import {loadParserOpts} from './utils/load-parser-opts';
import {pickConfig} from './utils/pick-config';

const w = <T>(_: unknown, b: ArrayLike<T> | null | undefined | false) =>
	Array.isArray(b) ? b : undefined;

export default async function load(
	seed: UserConfig = {},
	options: LoadOptions = {}
): Promise<QualifiedConfig> {
	const cwd = typeof options.cwd === 'undefined' ? process.cwd() : options.cwd;
	const loaded = await loadConfig(cwd, options.file);
	const base = loaded && loaded.filepath ? Path.dirname(loaded.filepath) : cwd;

	// Merge passed config with file based options
	const config = pickConfig(merge({}, loaded ? loaded.config : null, seed));

	const opts = merge(
		{extends: [], rules: {}, formatter: '@commitlint/format'},
		pick(config, 'extends', 'plugins', 'ignores', 'defaultIgnores')
	);

	// Resolve parserPreset key
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

	const preset = (pickConfig(
		mergeWith(extended, config, w)
	) as unknown) as UserPreset;
	preset.plugins = {};

	// TODO: check if this is still necessary with the new factory based conventional changelog parsers
	// config.extends = Array.isArray(config.extends) ? config.extends : [];

	// Resolve parser-opts from preset
	if (typeof preset.parserPreset === 'object') {
		preset.parserPreset.parserOpts = await loadParserOpts(
			preset.parserPreset.name,
			// TODO: fix the types for factory based conventional changelog parsers
			preset.parserPreset as any
		);
	}

	// Resolve config-relative formatter module
	if (typeof config.formatter === 'string') {
		preset.formatter =
			resolveFrom.silent(base, config.formatter) || config.formatter;
	}

	// resolve plugins
	if (Array.isArray(config.plugins)) {
		config.plugins.forEach((pluginKey: string) => {
			loadPlugin(preset.plugins, pluginKey, process.env.DEBUG === 'true');
		});
	}

	const rules = preset.rules ? preset.rules : {};
	const qualifiedRules = (await Promise.all(
		toPairs(rules || {}).map(entry => executeRule<any>(entry))
	)).reduce<QualifiedRules>((registry, item) => {
		const [key, value] = item as any;
		(registry as any)[key] = value;
		return registry;
	}, {});

	return {
		extends: preset.extends!,
		formatter: preset.formatter!,
		parserPreset: preset.parserPreset! as ParserPreset,
		ignores: preset.ignores!,
		defaultIgnores: preset.defaultIgnores!,
		plugins: preset.plugins!,
		rules: qualifiedRules
	};
}
