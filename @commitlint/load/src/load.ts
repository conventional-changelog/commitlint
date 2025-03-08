import path from "node:path";

import { validateConfig } from "@commitlint/config-validator";
import executeRule from "@commitlint/execute-rule";
import resolveExtends, {
	resolveFrom,
	resolveFromSilent,
	resolveGlobalSilent,
	loadParserPreset,
} from "@commitlint/resolve-extends";
import {
	LoadOptions,
	PluginRecords,
	QualifiedConfig,
	QualifiedRules,
	UserConfig,
} from "@commitlint/types";
import isPlainObject from "lodash.isplainobject";
import merge from "lodash.merge";
import uniq from "lodash.uniq";

import { loadConfig } from "./utils/load-config.js";
import { loadParserOpts } from "./utils/load-parser-opts.js";
import loadPlugin from "./utils/load-plugin.js";

/**
 * formatter should be kept as is when unable to resolve it from config directory
 */
const resolveFormatter = (formatter: string, parent?: string): string => {
	try {
		return resolveFrom(formatter, parent);
	} catch (error) {
		return formatter;
	}
};

export default async function load(
	seed: UserConfig = {},
	options: LoadOptions = {},
): Promise<QualifiedConfig> {
	const cwd = typeof options.cwd === "undefined" ? process.cwd() : options.cwd;
	const loaded = await loadConfig(cwd, options.file);
	const baseDirectory = loaded?.filepath ? path.dirname(loaded.filepath) : cwd;
	const configFilePath = loaded?.filepath;
	let config: UserConfig = {};
	if (loaded) {
		validateConfig(loaded.filepath || "", loaded.config);
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
		seed,
	);

	// Resolve parserPreset key
	if (typeof config.parserPreset === "string") {
		const resolvedParserPreset = resolveFrom(
			config.parserPreset,
			configFilePath,
		);

		config.parserPreset = {
			name: config.parserPreset,
			...(await loadParserPreset(resolvedParserPreset)),
		};
	}

	// Resolve extends key
	const extended = await resolveExtends(config, {
		prefix: "commitlint-config",
		cwd: baseDirectory,
		parserPreset: await config.parserPreset,
	});

	if (!extended.formatter || typeof extended.formatter !== "string") {
		extended.formatter = "@commitlint/format";
	}

	let plugins: PluginRecords = {};
	if (Array.isArray(extended.plugins)) {
		for (const plugin of uniq(extended.plugins)) {
			if (typeof plugin === "string") {
				plugins = await loadPlugin(
					plugins,
					plugin,
					process.env.DEBUG === "true",
				);
			} else {
				plugins.local = plugin;
			}
		}
	}

	const rules = (
		await Promise.all(
			Object.entries(extended.rules || {}).map((entry) => executeRule(entry)),
		)
	).reduce<QualifiedRules>((registry, item) => {
		// type of `item` can be null, but Object.entries always returns key pair
		const [key, value] = item!;
		registry[key] = value;
		return registry;
	}, {});

	const helpUrl =
		typeof extended.helpUrl === "string"
			? extended.helpUrl
			: typeof config.helpUrl === "string"
				? config.helpUrl
				: "https://github.com/conventional-changelog/commitlint/#what-is-commitlint";

	const prompt =
		extended.prompt && isPlainObject(extended.prompt) ? extended.prompt : {};

	return {
		extends: Array.isArray(extended.extends)
			? extended.extends
			: typeof extended.extends === "string"
				? [extended.extends]
				: [],
		// Resolve config-relative formatter module
		formatter: resolveFormatter(extended.formatter, configFilePath),
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

export { resolveFrom, resolveFromSilent, resolveGlobalSilent };
