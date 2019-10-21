import path from 'path';
import executeRule from '@commitlint/execute-rule';
import resolveExtends from '@commitlint/resolve-extends';
import {TargetCaseType} from '@commitlint/ensure';
import cosmiconfig, {CosmiconfigResult} from 'cosmiconfig';
import {toPairs, merge, mergeWith, pick, startsWith} from 'lodash';
import resolveFrom from 'resolve-from';
import loadPlugin from './utils/loadPlugin';

export interface LoadOptions {
	cwd?: string;
	file?: string;
}

export enum RuleSeverity {
	Warning = 1,
	Error = 2
}

export type RuleApplication = 'always' | 'never';

export type RuleConfigTuple<T> = ReadonlyArray<
	T extends void
		? [RuleSeverity, RuleApplication]
		: [RuleSeverity, RuleApplication, T]
>;

export enum RuleConfigQuality {
	User,
	Qualified
}

export type RuleConfig<
	V = RuleConfigQuality.Qualified,
	T = void
> = V extends false
	? RuleConfigTuple<T>
	:
			| (() => RuleConfigTuple<T>)
			| (() => RuleConfigTuple<Promise<T>>)
			| RuleConfigTuple<T>;

export type CaseRuleConfig<V = RuleConfigQuality.User> = RuleConfig<
	V,
	TargetCaseType
>;
export type LengthRuleConfig<V = RuleConfigQuality.User> = RuleConfig<
	V,
	number
>;
export type EnumRuleConfig<V = RuleConfigQuality.User> = RuleConfig<
	V,
	string[]
>;

export type RulesConfig<V = RuleConfigQuality.User> = {
	'body-case': CaseRuleConfig<V>;
	'body-empty': RuleConfig<V>;
	'body-leading-blank': RuleConfig<V>;
	'body-max-length': LengthRuleConfig<V>;
	'body-max-line-length': LengthRuleConfig<V>;
	'body-min-length': LengthRuleConfig<V>;
	'footer-empty': RuleConfig<V>;
	'footer-leading-blank': RuleConfig<V>;
	'footer-max-length': LengthRuleConfig<V>;
	'footer-max-line-length': LengthRuleConfig<V>;
	'footer-min-length': LengthRuleConfig<V>;
	'header-case': CaseRuleConfig<V>;
	'header-full-stop': RuleConfig<V>;
	'header-max-length': LengthRuleConfig<V>;
	'header-min-length': LengthRuleConfig<V>;
	'references-empty': RuleConfig<V>;
	'scope-case': CaseRuleConfig<V>;
	'scope-empty': RuleConfig<V>;
	'scope-enum': EnumRuleConfig<V>;
	'scope-max-length': LengthRuleConfig<V>;
	'scope-min-length': LengthRuleConfig<V>;
	'signed-off-by': RuleConfig<V>;
	'subject-case': CaseRuleConfig<V>;
	'subject-empty': RuleConfig<V>;
	'subject-full-stop': RuleConfig<V>;
	'subject-max-length': LengthRuleConfig<V>;
	'subject-min-length': LengthRuleConfig<V>;
	'type-case': CaseRuleConfig<V>;
	'type-empty': RuleConfig<V>;
	'type-enum': EnumRuleConfig<V>;
	'type-max-length': LengthRuleConfig<V>;
	'type-min-length': LengthRuleConfig<V>;
};

export interface UserConfig {
	extends?: string[];
	formatter?: unknown;
	rules?: Partial<RulesConfig>;
	parserPreset?: string | ParserPreset;
	ignores?: ((commit: string) => boolean)[];
	defaultIgnores?: boolean;
	plugins?: any[];
}

export type QualifiedRules = Partial<RulesConfig<RuleConfigQuality.Qualified>>;

export interface QualifiedConfig {
	extends: string[];
	formatter: unknown;
	rules: Partial<QualifiedRules>;
	parserPreset: ParserPreset;
	ignores: ((commit: string) => boolean)[];
	defaultIgnores: boolean;
	plugins: any[];
}

export interface ParserPreset {
	name: string;
	path: string;
	parserOpts?: unknown;
}

const w = <T>(_: unknown, b: ArrayLike<T> | null | undefined | false) =>
	Array.isArray(b) ? b : undefined;

const valid = (input: unknown): UserConfig =>
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

export default async (
	seed: UserConfig = {},
	options: LoadOptions = {}
): Promise<QualifiedConfig> => {
	const cwd = typeof options.cwd === 'undefined' ? process.cwd() : options.cwd;
	const loaded = await loadConfig(cwd, options.file);
	const base = loaded && loaded.filepath ? path.dirname(loaded.filepath) : cwd;

	// Merge passed config with file based options
	const preliminaryConfig = valid(
		merge({}, loaded ? loaded.config : null, seed)
	);
	const config = {
		...preliminaryConfig,
		parserPreset: await loadParserPreset(base, preliminaryConfig)
	};

	const opts = merge(
		{extends: [], rules: {}, formatter: '@commitlint/format'},
		pick(config, 'extends', 'plugins', 'ignores', 'defaultIgnores')
	);

	// Resolve extends key
	const extended = resolveExtends(opts, {
		prefix: 'commitlint-config',
		cwd: base,
		parserPreset: config.parserPreset
	});

	const preliminaryPreset = valid(mergeWith(extended, config, w));
	const preset = {
		...preliminaryPreset,
		parserPreset: await loadParserPreset(base, preliminaryPreset)
	};

	config.extends = Array.isArray(config.extends) ? config.extends : [];

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
};

async function loadParserPreset(
	base: string,
	config: UserConfig
): Promise<unknown> {
	if (typeof config.parserPreset !== 'string') {
		return config.parserPreset;
	}

	// Resolve parserPreset key when overwritten by main config
	const resolvedParserPreset = resolveFrom(base, config.parserPreset);
	const importedParserPreset = require(resolvedParserPreset);

	return {
		name: config.parserPreset,
		path: resolvedParserPreset,
		parserOpts: isResolvablePreset(importedParserPreset)
			? await importedParserPreset.parserOpts
			: importedParserPreset.parserOpts
	};
}

interface ResolveablePreset {
	parserOpts: Promise<unknown>;
}

function isPromise<T>(input: unknown): input is Promise<T> {
	return (
		typeof input === 'object' &&
		input !== null &&
		typeof (input as any).then === 'function'
	);
}

function isResolvablePreset(preset: unknown): preset is ResolveablePreset {
	return (
		typeof preset === 'object' &&
		preset !== null &&
		isPromise((preset as any).parserOpts)
	);
}

async function loadConfig(
	cwd: string,
	configPath?: string
): Promise<CosmiconfigResult> {
	const explorer = cosmiconfig('commitlint');

	const explicitPath = configPath ? path.resolve(cwd, configPath) : undefined;
	const explore = explicitPath ? explorer.load : explorer.search;
	const searchPath = explicitPath ? explicitPath : cwd;
	const local = await explore(searchPath);

	if (local) {
		return local;
	}

	return null;
}

async function loadParserOpts(
	parserName: string,
	pendingParser: Promise<unknown>
): Promise<unknown> {
	// Await for the module, loaded with require
	const parser = await pendingParser;

	// Await parser opts if applicable
	if (
		typeof parser === 'object' &&
		typeof parser !== null &&
		typeof (parser as any).parserOpts === 'object' &&
		typeof (parser as any).parserOpts.then === 'function'
	) {
		return (await (parser as any).parserOpts).parserOpts;
	}

	// Create parser opts from factory
	if (
		typeof parser === 'object' &&
		typeof parser !== null &&
		typeof (parser as any).parserOpts === 'function' &&
		startsWith(parserName, 'conventional-changelog-')
	) {
		return await new Promise(resolve => {
			(parser as any).parserOpts((_: any, opts: any) => {
				resolve(opts.parserOpts);
			});
		});
	}

	// Pull nested paserOpts, might happen if overwritten with a module in main config
	if (
		typeof parser === 'object' &&
		typeof parser !== null &&
		typeof (parser as any).parserOpts === 'object' &&
		typeof (parser as any).parserOpts.parserOpts === 'object'
	) {
		return (parser as any).parserOpts.parserOpts;
	}

	return (parser as any).parserOpts;
}
