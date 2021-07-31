import {UserPromptConfig} from './prompt';
import {
	AsyncRule,
	Rule,
	RuleConfigQuality,
	RulesConfig,
	SyncRule,
} from './rules';

export type PluginRecords = Record<string, Plugin>;

export interface Plugin {
	rules: {
		[ruleName: string]: Rule | AsyncRule | SyncRule;
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
	helpUrl?: string;
	prompt?: UserPromptConfig;
}

export interface UserPreset {
	extends?: string[];
	formatter?: string;
	rules?: Partial<RulesConfig>;
	parserPreset?: string | ParserPreset;
	ignores?: ((commit: string) => boolean)[];
	defaultIgnores?: boolean;
	plugins: PluginRecords;
	prompt?: UserPromptConfig;
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
	helpUrl: string;
	prompt: UserPromptConfig;
}

export interface ParserPreset {
	name: string;
	path: string;
	parserOpts?: unknown;
}
