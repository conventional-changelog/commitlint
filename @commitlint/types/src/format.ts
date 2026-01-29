import type pc from "picocolors";
import { QualifiedRules } from "./load.js";
import { RuleConfigSeverity } from "./rules.js";

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

// Extract color function names from picocolors, excluding non-color properties
export type PicocolorsColor = Exclude<
	keyof typeof pc,
	"isColorSupported" | "createColors"
>;

// Keep ChalkColor as an alias for backwards compatibility
export type ChalkColor = PicocolorsColor;

export interface FormatOptions {
	color?: boolean;
	signs?: readonly [string, string, string];
	colors?: readonly [PicocolorsColor, PicocolorsColor, PicocolorsColor];
	verbose?: boolean;
	helpUrl?: string;
}
