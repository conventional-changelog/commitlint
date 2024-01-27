import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';

import {validateConfig} from '@commitlint/config-validator';
import executeRule from '@commitlint/execute-rule';
import resolveExtends from '@commitlint/resolve-extends';
import {
	LoadOptions,
	PluginRecords,
	QualifiedConfig,
	QualifiedRules,
	UserConfig,
} from '@commitlint/types';
import {resolve} from 'import-meta-resolve';
import isPlainObject from 'lodash.isplainobject';
import merge from 'lodash.merge';
import uniq from 'lodash.uniq';

import {loadConfig} from './utils/load-config.js';
import {loadParserOpts} from './utils/load-parser-opts.js';
import loadPlugin from './utils/load-plugin.js';

const dynamicImport = async <T>(id: string): Promise<T> => {
	const imported = await import(
		path.isAbsolute(id) ? pathToFileURL(id).toString() : id
	);
	return ('default' in imported && imported.default) || imported;
};

const resolveFrom = (parent: string, id: string) => {
	let resolved: string | undefined;
	let error: Error | undefined;

	for (const suffix of ['', '.js', '.json', '/index.js', '/index.json']) {
		try {
			resolved = resolve(
				id + suffix,
				pathToFileURL(path.resolve(parent, '__test__.js')).toString()
			);
			if (/^file:/.test(resolved)) {
				resolved = fileURLToPath(resolved);
			}
			break;
		} catch (err) {
			if (!error) {
				error = err as Error;
			}
		}
	}

	if (resolved) {
		return resolved;
	}

	throw (
		error ||
		Object.assign(new Error(`Cannot find module "${id}" from "${parent}"`), {
			code: 'MODULE_NOT_FOUND',
		})
	);
};

const resolveParserPreset = async (resolvedParserPreset: string) => {
	let finalParserPreset = resolvedParserPreset;
	let finalParserOpts: unknown;
	let finalError: Error | undefined;

	for (const suffix of ['', '.js', '.json', '/index.js', '/index.json']) {
		try {
			finalParserOpts = await dynamicImport(resolvedParserPreset + suffix);
			finalParserPreset = resolvedParserPreset + suffix;
			break;
		} catch (err) {
			if (!finalError) {
				finalError = err as Error;
			}
		}
	}

	if (finalError) {
		throw finalError;
	}

	return {
		path: `./${path.relative(process.cwd(), finalParserPreset)}`
			.split(path.sep)
			.join('/'),
		parserOpts: finalParserOpts,
	};
};

export default async function load(
	seed: UserConfig = {},
	options: LoadOptions = {}
): Promise<QualifiedConfig> {
	const cwd = typeof options.cwd === 'undefined' ? process.cwd() : options.cwd;
	const loaded = await loadConfig(cwd, options.file);
	const base = loaded && loaded.filepath ? path.dirname(loaded.filepath) : cwd;
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
			...resolveParserPreset(resolvedParserPreset),
		};
	}

	// Resolve extends key
	const extended = await resolveExtends(config, {
		prefix: 'commitlint-config',
		cwd: base,
		parserPreset: await config.parserPreset,
	});

	if (!extended.formatter || typeof extended.formatter !== 'string') {
		extended.formatter = '@commitlint/format';
	}

	let plugins: PluginRecords = {};
	if (Array.isArray(extended.plugins)) {
		for (const plugin of uniq(extended.plugins)) {
			if (typeof plugin === 'string') {
				plugins = await loadPlugin(
					plugins,
					plugin,
					process.env.DEBUG === 'true'
				);
			} else {
				plugins.local = plugin;
			}
		}
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
		formatter: resolveFrom(base, extended.formatter) || extended.formatter,
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
