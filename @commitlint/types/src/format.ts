import type pc from "picocolors";
import { QualifiedRules } from "./load.js";
import { RuleConfigSeverity } from "./rules.js";

export type Formatter = (
	report: FormattableReport,
	options: FormatOptions,
) => string;

export interface Position {
	/** 1-indexed line in the input. */
	line: number;
	/** 1-indexed character column on the line (not display width). */
	column: number;
	/** 0-indexed character offset from the start of the input. */
	offset: number;
}

export interface FormattableProblem {
	level: RuleConfigSeverity;
	name: keyof QualifiedRules;
	message: string;
	start?: Position;
	end?: Position;
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
	showPosition?: boolean;
}
