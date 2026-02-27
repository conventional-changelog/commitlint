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
	const { color: enabled = true, showPosition = false } = options;
	const { errors = [], warnings = [], input = "" } = result;

	if (!input) {
		return [""];
	}

	const sign = "⧗";
	const decoration = enabled ? pc.gray(sign) : sign;

	const decoratedInput = enabled ? pc.bold(input) : input;
	const hasProblems = errors.length > 0 || warnings.length > 0;

	if (!hasProblems) {
		return options.verbose ? [`${decoration}   input: ${decoratedInput}`] : [];
	}

	const positionIndicator = showPosition
		? getPositionIndicator([...errors, ...warnings], input)
		: undefined;

	const lines: string[] = [`${decoration}   input: ${decoratedInput}`];

	if (positionIndicator) {
		lines.push(positionIndicator);
	}

	return lines;
}

function getPositionIndicator(
	problems: FormattableProblem[],
	input: string,
): string | undefined {
	const problemWithPosition = problems.find(
		(problem) => problem?.start !== undefined && problem?.end !== undefined,
	);
	if (!problemWithPosition?.start || !problemWithPosition?.end) {
		return undefined;
	}

	const { start, end } = problemWithPosition;
	const padding = "           ";

	const tilde = "~";
	let indicator = "";

	if (start.line === 1) {
		const spacesBefore = Math.max(0, start.column - 1);
		const tildeLength = Math.max(1, end.column - start.column);
		indicator = padding + " ".repeat(spacesBefore) + tilde.repeat(tildeLength);
	} else if (start.line === 2) {
		const headerEndIndex = input.indexOf("\n\n");
		if (headerEndIndex === -1) return undefined;

		const bodyText = input.slice(headerEndIndex + 2);
		const firstBodyLine = bodyText.split("\n")[0];
		const lineLength = firstBodyLine.length;

		if (start.column <= lineLength + 1) {
			const spacesBefore = Math.max(0, start.column - 1);
			const tildeLength = Math.max(
				1,
				Math.min(end.column - start.column, lineLength - (start.column - 1)),
			);
			indicator =
				padding + " ".repeat(spacesBefore) + tilde.repeat(tildeLength);
		}
	} else if (start.line === 3) {
		const footerStartIndex = input.lastIndexOf("\n\n");
		if (footerStartIndex === -1) return undefined;

		const footerText = input.slice(footerStartIndex + 2);
		const firstFooterLine = footerText.split("\n")[0];
		const lineLength = firstFooterLine.length;

		if (start.column <= lineLength + 1) {
			const spacesBefore = Math.max(0, start.column - 1);
			const tildeLength = Math.max(
				1,
				Math.min(end.column - start.column, lineLength - (start.column - 1)),
			);
			indicator =
				padding + " ".repeat(spacesBefore) + tilde.repeat(tildeLength);
		}
	}

	return indicator || undefined;
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
