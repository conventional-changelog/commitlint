import {IsIgnoredOptions} from '@commitlint/is-ignored';
import {RuleConfigTuple, PluginRecords, RuleSeverity} from '@commitlint/load';
import {ParserOptions} from '@commitlint/parse';

export type LintRuleConfig = Record<
	string,
	| Readonly<[RuleSeverity.Disabled]>
	| RuleConfigTuple<void>
	| RuleConfigTuple<unknown>
>;

export interface LintOptions {
	/** If it should ignore the default commit messages (defaults to `true`) */
	defaultIgnores?: IsIgnoredOptions['defaults'];
	/** Additional commits to ignore, defined by ignore matchers  */
	ignores?: IsIgnoredOptions['ignores'];
	/** The parser configuration to use when linting the commit */
	parserOpts?: ParserOptions;

	plugins?: PluginRecords;
}

export interface LintOutcome {
	/** The linted commit, as string */
	input: string;
	/** If the linted commit is considered valid */
	valid: boolean;
	/** All errors, per rule, for the commit */
	errors: LintRuleOutcome[];
	/** All warnings, per rule, for the commit */
	warnings: LintRuleOutcome[];
}

export interface LintRuleOutcome {
	/** If the commit is considered valid for the rule */
	valid: boolean;
	/** The "severity" of the rule (1 = warning, 2 = error) */
	level: 0 | 1 | 2;
	/** The name of the rule */
	name: string;
	/** The message returned from the rule, if invalid */
	message: string;
}
