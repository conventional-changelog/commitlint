import {Rule, RulesConfig, RuleConfigQuality} from './rules';

export type PluginRecords = Record<string, Plugin>;

export interface Plugin {
	rules: {
		[ruleName: string]: Rule<unknown>;
	};
}

export interface LoadOptions {
	cwd?: string;
	file?: string;
}

export interface UserConfig {
	extends?: string[];
	formatter?: string;
	rules?: Partial<RulesConfig>;
	parserPreset?: string | ParserPreset;
	ignores?: ((commit: string) => boolean)[];
	defaultIgnores?: boolean;
	plugins?: (string | Plugin)[];
}

export interface UserPreset {
	extends?: string[];
	formatter?: string;
	rules?: Partial<RulesConfig>;
	parserPreset?: string | ParserPreset;
	ignores?: ((commit: string) => boolean)[];
	defaultIgnores?: boolean;
	plugins: PluginRecords;
}

export type QualifiedRules = Partial<RulesConfig<RuleConfigQuality.Qualified>>;

export interface QualifiedConfig {
	extends: string[];
	formatter: string;
	rules: QualifiedRules;
	parserPreset: ParserPreset;
	ignores: ((commit: string) => boolean)[];
	defaultIgnores: boolean;
	plugins: PluginRecords;
}

export interface ParserPreset {
	name: string;
	path: string;
	parserOpts?: unknown;
}
