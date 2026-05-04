import pc from "picocolors";
import {
	PicocolorsColor,
	FormattableReport,
	FormatOptions,
	FormattableResult,
	WithInput,
	FormattableProblem,
} from "@commitlint/types";

const DEFAULT_SIGNS = [" ", "⚠", "✖"] as const;
const DEFAULT_COLORS: readonly [
	PicocolorsColor,
	PicocolorsColor,
	PicocolorsColor,
] = ["white", "yellow", "red"] as const;

export function format(
	report: FormattableReport = {},
	options: FormatOptions = {},
): string {
	const { results = [] } = report;
	const fi = (result: FormattableResult & WithInput) =>
		formatInput(result, options);
	const fr = (result: FormattableResult) => formatResult(result, options);

	return results
		.filter((r) => Array.isArray(r.warnings) || Array.isArray(r.errors))
		.map((result) => [...fi(result), ...fr(result)])
		.reduce(
			(acc, item) => (Array.isArray(item) ? [...acc, ...item] : [...acc, item]),
			[],
		)
		.join("\n");
}

function formatInput(
	result: FormattableResult & WithInput,
	options: FormatOptions = {},
): string[] {
	const { color: enabled = true, showPosition = true } = options;
	const { errors = [], warnings = [], input = "" } = result;

	if (!input) {
		return [""];
	}

	const sign = "⧗";
	const decoration = enabled ? pc.gray(sign) : sign;
	const prefix = `${decoration}   input: `;
	const visiblePrefixLength = `${sign}   input: `.length;
	const padding = " ".repeat(visiblePrefixLength);

	const hasProblems = errors.length > 0 || warnings.length > 0;
	const normalizedInput = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	const inputLines = normalizedInput.split("\n");

	const renderedInputLines = inputLines.map((lineText, i) => {
		const decoratedLine = enabled ? pc.bold(lineText) : lineText;
		const linePrefix = i === 0 ? prefix : padding;
		return `${linePrefix}${decoratedLine}`;
	});

	if (!hasProblems) {
		return options.verbose ? renderedInputLines : [];
	}

	const indicator = showPosition
		? getPositionIndicator(
				[...errors, ...warnings],
				inputLines,
				visiblePrefixLength,
			)
		: undefined;

	if (!indicator) {
		return renderedInputLines;
	}

	const lines: string[] = [];
	for (let i = 0; i < renderedInputLines.length; i++) {
		lines.push(renderedInputLines[i]);
		if (i + 1 === indicator.line) {
			lines.push(indicator.text);
		}
	}
	return lines;
}

function getPositionIndicator(
	problems: FormattableProblem[],
	inputLines: string[],
	prefixLength: number,
): { text: string; line: number } | undefined {
	const problemWithPosition = problems.find(
		(problem) => problem?.start !== undefined && problem?.end !== undefined,
	);
	if (!problemWithPosition?.start || !problemWithPosition?.end) {
		return undefined;
	}

	const targetLine = inputLines[problemWithPosition.start.line - 1];
	if (targetLine === undefined) {
		return undefined;
	}

	const padding = " ".repeat(prefixLength);
	const caret = "^";
	const spacesBefore = Math.max(0, problemWithPosition.start.column - 1);
	const text = padding + " ".repeat(spacesBefore) + caret;

	return { text, line: problemWithPosition.start.line };
}

export function formatResult(
	result: FormattableResult = {},
	options: FormatOptions = {},
): string[] {
	const {
		signs = DEFAULT_SIGNS,
		colors = DEFAULT_COLORS,
		color: enabled = true,
	} = options;
	const { errors = [], warnings = [] } = result;

	const problems = [...errors, ...warnings].map((problem) => {
		const sign = signs[problem.level] || "";
		const colorName: PicocolorsColor =
			colors[problem.level] || ("white" as const);
		const colorFn = pc[colorName];
		const decoration = enabled ? colorFn(sign) : sign;
		const name = enabled ? pc.gray(`[${problem.name}]`) : `[${problem.name}]`;
		return `${decoration}   ${problem.message} ${name}`;
	});

	const sign = selectSign(result);
	const colorName = selectColor(result);

	const deco = enabled ? pc[colorName](sign) : sign;
	const el = errors.length;
	const wl = warnings.length;
	const hasProblems = problems.length > 0;

	const summary =
		options.verbose || hasProblems
			? `${deco}   found ${el} problems, ${wl} warnings`
			: undefined;

	const fmtSummary =
		enabled && typeof summary === "string" ? pc.bold(summary) : summary;

	const help =
		hasProblems && options.helpUrl
			? `ⓘ   Get help: ${options.helpUrl}`
			: undefined;

	return [
		...problems,
		hasProblems ? "" : undefined,
		fmtSummary,
		help,
		hasProblems ? "" : undefined,
	].filter((line): line is string => typeof line === "string");
}

export default format;

function selectSign(result: FormattableResult): string {
	if ((result.errors || []).length > 0) {
		return "✖";
	}
	return (result.warnings || []).length ? "⚠" : "✔";
}

function selectColor(result: FormattableResult): PicocolorsColor {
	if ((result.errors || []).length > 0) {
		return "red";
	}
	return (result.warnings || []).length ? "yellow" : "green";
}
