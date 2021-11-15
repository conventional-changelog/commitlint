import {TargetCaseType} from './ensure';
import {Commit} from './parse';

/**
 * Rules match the input either as successful or failed.
 * For example, when `header-full-stop` detects a full stop and is set as "always"; it's true.
 * If the `header-full-stop` discovers a full stop but is set to "never"; it's false.
 */
export type RuleOutcome = Readonly<[boolean, string?]>;

/**
 * Rules receive a parsed commit, condition, and possible additional settings through value.
 * All rules should provide the most sensible rule condition and value.
 */
export type RuleType = 'async' | 'sync' | 'either';

export type BaseRule<Value = never, Type extends RuleType = 'either'> = (
	parsed: Commit,
	when?: RuleConfigCondition,
	value?: Value
) => Type extends 'either'
	? RuleOutcome | Promise<RuleOutcome>
	: Type extends 'async'
	? Promise<RuleOutcome>
	: Type extends 'sync'
	? RuleOutcome
	: never;

export type Rule<Value = never> = BaseRule<Value, 'either'>;
export type AsyncRule<Value = never> = BaseRule<Value, 'async'>;
export type SyncRule<Value = never> = BaseRule<Value, 'sync'>;

/**
 * Rules always have a severity.
 * Severity indicates what to do if the rule is found to be broken
 * 0 - Disable this rule
 * 1 - Warn for violations
 * 2 - Error for violations
 */
export enum RuleConfigSeverity {
	Disabled = 0,
	Warning = 1,
	Error = 2,
}

/**
 * Rules always have a condition.
 * It can be either "always" (as tested), or "never" (as tested).
 * For example, `header-full-stop` can be enforced as "always" or "never".
 */
export type RuleConfigCondition = 'always' | 'never';

export type RuleConfigTuple<T> = T extends void
	?
			| Readonly<[RuleConfigSeverity.Disabled]>
			| Readonly<[RuleConfigSeverity, RuleConfigCondition]>
	:
			| Readonly<[RuleConfigSeverity.Disabled]>
			| Readonly<[RuleConfigSeverity, RuleConfigCondition, T]>;

export enum RuleConfigQuality {
	User,
	Qualified,
}

export type QualifiedRuleConfig<T> =
	| (() => RuleConfigTuple<T>)
	| (() => Promise<RuleConfigTuple<T>>)
	| RuleConfigTuple<T>;

export type RuleConfig<
	V = RuleConfigQuality.Qualified,
	T = void
> = V extends RuleConfigQuality.Qualified
	? RuleConfigTuple<T>
	: QualifiedRuleConfig<T>;

export type CaseRuleConfig<V = RuleConfigQuality.User> = RuleConfig<
	V,
	TargetCaseType | TargetCaseType[]
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
	'body-full-stop': RuleConfig<V, string>;
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
	'header-full-stop': RuleConfig<V, string>;
	'header-max-length': LengthRuleConfig<V>;
	'header-min-length': LengthRuleConfig<V>;
	'references-empty': RuleConfig<V>;
	'scope-case': CaseRuleConfig<V>;
	'scope-empty': RuleConfig<V>;
	'scope-enum': EnumRuleConfig<V>;
	'scope-max-length': LengthRuleConfig<V>;
	'scope-min-length': LengthRuleConfig<V>;
	'signed-off-by': RuleConfig<V, string>;
	'subject-case': CaseRuleConfig<V>;
	'subject-empty': RuleConfig<V>;
	'subject-full-stop': RuleConfig<V, string>;
	'subject-max-length': LengthRuleConfig<V>;
	'subject-min-length': LengthRuleConfig<V>;
	'trailer-exists': RuleConfig<V, string>;
	'type-case': CaseRuleConfig<V>;
	'type-empty': RuleConfig<V>;
	'type-enum': EnumRuleConfig<V>;
	'type-max-length': LengthRuleConfig<V>;
	'type-min-length': LengthRuleConfig<V>;
	// Plugins may add their custom rules
	[key: string]: AnyRuleConfig<V>;
};

export type AnyRuleConfig<V> = RuleConfig<V, unknown> | RuleConfig<V, void>;
