import {QualifiedRules} from './load';
import {RuleConfigSeverity} from './rules';
import pc from 'picocolors';

export type PcColor = keyof typeof pc;

export type Formatter = (
	report: FormattableReport,
	options: FormatOptions
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

export interface FormatOptions {
	color?: boolean;
	signs?: readonly [string, string, string];
	colors?: readonly [PcColor, PcColor, PcColor];
	verbose?: boolean;
	helpUrl?: string;
}
