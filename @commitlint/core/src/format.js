import chalk from 'chalk';

const DEFAULT_SIGNS = [' ', '⚠', '✖'];
const DEFAULT_COLORS = ['white', 'yellow', 'red'];

export default function format(report = {}, options = {}) {
	const {
		signs = DEFAULT_SIGNS,
		colors = DEFAULT_COLORS,
		color: enabled = true
	} = options;
	const {errors = [], warnings = []} = report;

	const problems = [...errors, ...warnings].map(problem => {
		const sign = signs[problem.level] || '';
		const color = colors[problem.level] || 'white';
		const decoration = enabled ? chalk[color](sign) : sign;
		const name = enabled
			? chalk.grey(`[${problem.name}]`)
			: `[${problem.name}]`;
		return `${decoration}   ${problem.message} ${name}`;
	});

	const sign = selectSign({errors, warnings});
	const color = selectColor({errors, warnings});

	const decoration = enabled ? chalk[color](sign) : sign;
	const summary = `${decoration}   found ${errors.length} problems, ${warnings.length} warnings`;
	return [...problems, enabled ? chalk.bold(summary) : summary];
}

function selectSign(report) {
	if (report.errors.length > 0) {
		return '✖';
	}
	return report.warnings.length ? '⚠' : '✔';
}

function selectColor(report) {
	if (report.errors.length > 0) {
		return 'red';
	}
	return report.warnings.length ? 'yellow' : 'green';
}
