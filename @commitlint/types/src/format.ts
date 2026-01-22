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

// Picocolors color names - subset of what's available
export type PicocolorsColor =
	| "reset"
	| "bold"
	| "dim"
	| "italic"
	| "underline"
	| "inverse"
	| "hidden"
	| "strikethrough"
	| "black"
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "white"
	| "gray"
	| "bgBlack"
	| "bgRed"
	| "bgGreen"
	| "bgYellow"
	| "bgBlue"
	| "bgMagenta"
	| "bgCyan"
	| "bgWhite";

// Keep ChalkColor as an alias for backwards compatibility
export type ChalkColor = PicocolorsColor;

export interface FormatOptions {
	color?: boolean;
	signs?: readonly [string, string, string];
	colors?: readonly [PicocolorsColor, PicocolorsColor, PicocolorsColor];
	verbose?: boolean;
	helpUrl?: string;
}
