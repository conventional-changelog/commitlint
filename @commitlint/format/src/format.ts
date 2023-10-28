import {
	FormattableReport,
	FormatOptions,
	FormattableResult,
	WithInput,
	PcColor,
} from '@commitlint/types';
import pc from 'picocolors';

const DEFAULT_SIGNS = [' ', '⚠', '✖'] as const;

const DEFAULT_COLORS: [PcColor, PcColor, PcColor] = ['white', 'yellow', 'red'];

export function format(
	report: FormattableReport = {},
	options: FormatOptions = {}
): string {
	const {results = []} = report;
	const fi = (result: FormattableResult & WithInput) =>
		formatInput(result, options);
	const fr = (result: FormattableResult) => formatResult(result, options);

	return results
		.filter((r) => Array.isArray(r.warnings) || Array.isArray(r.errors))
		.map((result) => [...fi(result), ...fr(result)])
		.reduce(
			(acc, item) => (Array.isArray(item) ? [...acc, ...item] : [...acc, item]),
			[]
		)
		.join('\n');
}

function formatInput(
	result: FormattableResult & WithInput,
	options: FormatOptions = {}
): string[] {
	const {color: enabled = true} = options;
	const {errors = [], warnings = [], input = ''} = result;

	if (!input) {
		return [''];
	}

	const sign = '⧗';
	const decoration = enabled ? pc.gray(sign) : sign;
	const commitText = errors.length > 0 ? input : input.split('\n')[0];

	const decoratedInput = enabled ? pc.bold(commitText) : commitText;
	const hasProblems = errors.length > 0 || warnings.length > 0;

	return options.verbose || hasProblems
		? [`${decoration}   input: ${decoratedInput}`]
		: [];
}

export function formatResult(
	result: FormattableResult = {},
	options: FormatOptions = {}
): string[] {
	const {
		signs = DEFAULT_SIGNS,
		colors = DEFAULT_COLORS,
		color: enabled = true,
	} = options;
	const {errors = [], warnings = []} = result;

	const problems = [...errors, ...warnings].map((problem) => {
		const sign = signs[problem.level] || '';
		const color = pc[colors[problem.level]] || pc[DEFAULT_COLORS[0]];
		const decoration = enabled ? color(sign) : sign;
		const name = enabled ? pc.gray(`[${problem.name}]`) : `[${problem.name}]`;
		return `${decoration}   ${problem.message} ${name}`;
	});

	const sign = selectSign(result);
	const color = selectColor(result);

	const deco = enabled ? color(sign) : sign;
	const el = errors.length;
	const wl = warnings.length;
	const hasProblems = problems.length > 0;

	const summary =
		options.verbose || hasProblems
			? `${deco}   found ${el} problems, ${wl} warnings`
			: undefined;

	const fmtSummary =
		enabled && typeof summary === 'string' ? pc.bold(summary) : summary;

	const help =
		hasProblems && options.helpUrl
			? `ⓘ   Get help: ${options.helpUrl}`
			: undefined;

	return [
		...problems,
		hasProblems ? '' : undefined,
		fmtSummary,
		help,
		hasProblems ? '' : undefined,
	].filter((line): line is string => typeof line === 'string');
}

export default format;

function selectSign(result: FormattableResult): string {
	if ((result.errors || []).length > 0) {
		return '✖';
	}
	return (result.warnings || []).length ? '⚠' : '✔';
}

function selectColor(result: FormattableResult) {
	if ((result.errors || []).length > 0) {
		return 'red';
	}
	return (result.warnings || []).length ? 'yellow' : 'green';
}
