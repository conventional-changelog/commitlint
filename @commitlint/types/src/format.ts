import * as chalk from 'chalk';
import {QualifiedRules} from './load';
import {RuleConfigSeverity} from './rules';

export type Formatter = (
	report: FormattableReport,
	options: FormatOptions,
) => string;

export interface FormattableProblem {
	level: RuleConfigSeverity;
	name: keyof QualifiedRules;
	message: string;
}

export interface FormattableResult {
	errors?: FormattableProblem[];
	warnings?: FormattableProblem[];
}

export interface WithInput {
	input?: string;
}

export interface FormattableReport {
	results?: (FormattableResult & WithInput)[];
}

export type ChalkColor = typeof chalk.Color | typeof chalk.Modifiers;

export interface FormatOptions {
	color?: boolean;
	signs?: readonly [string, string, string];
	colors?: readonly [ChalkColor, ChalkColor, ChalkColor];
	verbose?: boolean;
	helpUrl?: string;
}
