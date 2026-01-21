import type { ParserOptions as Options } from "conventional-commits-parser";
import { IsIgnoredOptions } from "./is-ignored.js";
import { PluginRecords } from "./load.js";
import { RuleConfigSeverity, RuleConfigTuple } from "./rules.js";

export type LintRuleConfig = Record<
	string,
	| Readonly<[RuleConfigSeverity.Disabled]>
	| RuleConfigTuple<void>
	| RuleConfigTuple<unknown>
>;

export interface LintOptions {
	/** If it should ignore the default commit messages (defaults to `true`) */
	defaultIgnores?: IsIgnoredOptions["defaults"];
	/** Additional commits to ignore, defined by ignore matchers  */
	ignores?: IsIgnoredOptions["ignores"];
	/** The parser configuration to use when linting the commit */
	parserOpts?: Options;

	plugins?: PluginRecords;
	helpUrl?: string;
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
	level: RuleConfigSeverity;
	/** The name of the rule */
	name: string;
	/** The message returned from the rule, if invalid */
	message: string;
}
