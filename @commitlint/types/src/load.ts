import {TargetCaseType} from './ensure';
import {Rule, RuleCondition} from './rules';

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

export enum RuleSeverity {
	Disabled = 0,
	Warning = 1,
	Error = 2
}

export type RuleConfigTuple<T> = T extends void
	? Readonly<[RuleSeverity, RuleCondition]>
	: Readonly<[RuleSeverity, RuleCondition, T]>;

export enum RuleConfigQuality {
	User,
	Qualified
}

export type QualifiedRuleConfig<T> =
	| (() => RuleConfigTuple<T>)
	| (() => RuleConfigTuple<Promise<T>>)
	| RuleConfigTuple<T>;

export type RuleConfig<
	V = RuleConfigQuality.Qualified,
	T = void
> = V extends RuleConfigQuality.Qualified
	? RuleConfigTuple<T>
	: QualifiedRuleConfig<T>;

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
	plugins?: string[];
}

export interface UserPreset {
	extends?: string[];
	formatter?: unknown;
	rules?: Partial<RulesConfig>;
	parserPreset?: string | ParserPreset;
	ignores?: ((commit: string) => boolean)[];
	defaultIgnores?: boolean;
	plugins: PluginRecords;
}

export type QualifiedRules = Partial<RulesConfig<RuleConfigQuality.Qualified>>;

export interface QualifiedConfig {
	extends: string[];
	formatter: unknown;
	rules: Partial<QualifiedRules>;
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
