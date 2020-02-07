import {Commit} from './parse';

/**
 * Rules always have a condition.
 * It can be either "always" (as tested), or "never" (as tested).
 * For example, `header-full-stop` can be enforced as "always" or "never".
 */
export type RuleCondition = 'always' | 'never';

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
	when?: RuleCondition,
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
