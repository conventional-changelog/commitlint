import chalk from 'chalk';

const DEFAULT_SIGNS = [' ', '⚠', '✖'] as const;
const DEFAULT_COLORS = ['white', 'yellow', 'red'] as const;

export interface FormattableProblem {
	level: 0 | 1 | 2;
	name: string;
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

export type ChalkColor = keyof typeof chalk;

export interface FormatOptions {
	color?: boolean;
	signs?: readonly [string, string, string];
	colors?: readonly [ChalkColor, ChalkColor, ChalkColor];
	verbose?: boolean;
	helpUrl?: string;
}

export function format(
	report: FormattableReport = {},
	options: FormatOptions = {}
) {
	const {results = []} = report;
	const fi = (result: FormattableResult & WithInput) =>
		formatInput(result, options);
	const fr = (result: FormattableResult) => formatResult(result, options);

	return results
		.filter(r => Array.isArray(r.warnings) || Array.isArray(r.errors))
		.map(result => [fi(result), fr(result), ''].join('\n'))
		.join('\n');
}

function formatInput(
	result: FormattableResult & WithInput,
	options: FormatOptions = {}
): string {
	const {color: enabled = true} = options;
	const {errors = [], input = ''} = result;

	if (!input) {
		return '';
	}

	const sign = '⧗';
	const decoration = enabled ? chalk.gray(sign) : sign;
	const commitText = errors.length > 0 ? input : input.split('\n')[0];

	const decoratedInput = enabled ? chalk.bold(commitText) : commitText;

	return `${decoration}   input: ${decoratedInput}`;
}

export function formatResult(
	result: FormattableResult = {},
	options: FormatOptions = {}
): string[] {
	const {
		signs = DEFAULT_SIGNS,
		colors = DEFAULT_COLORS,
		color: enabled = true
	} = options;
	const {errors = [], warnings = []} = result;

	const problems = [...errors, ...warnings].map(problem => {
		const sign = signs[problem.level] || '';
		const color: ChalkColor = colors[problem.level] || ('white' as const);
		const decoration = enabled ? ((chalk as any)[color] as any)(sign) : sign;
		const name = enabled
			? chalk.grey(`[${problem.name}]`)
			: `[${problem.name}]`;
		return `${decoration}   ${problem.message} ${name}`;
	});

	const sign = selectSign(result);
	const color = selectColor(result);

	const deco = enabled ? (chalk[color] as any)(sign) : sign;
	const el = errors.length;
	const wl = warnings.length;
	const needsHelp = errors.length > 0 || warnings.length > 0;

	const lines = [
		`${deco}   found ${el} problems, ${wl} warnings`,
		options.helpUrl && needsHelp ? `Get help: ${options.helpUrl}` : undefined
	];

	const summary = lines
		.filter(line => typeof line === 'string')
		.join('\n');

	return [...problems, enabled ? chalk.bold(summary) : summary];
}

export default format;

function selectSign(result: FormattableResult): string {
	if ((result.errors || []).length > 0) {
		return '✖';
	}
	return (result.warnings || []).length ? '⚠' : '✔';
}

function selectColor(result: FormattableResult): keyof typeof chalk {
	if ((result.errors || []).length > 0) {
		return 'red';
	}
	return (result.warnings || []).length ? 'yellow' : 'green';
}
