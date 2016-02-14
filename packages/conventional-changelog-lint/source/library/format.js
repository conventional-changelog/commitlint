import chalk from 'chalk';

export default function format(report, options = {}) {
	const {signs, colors, color: enabled} = options;
	const fmt = new chalk.constructor({enabled});

	const problems = [...report.errors, ...report.warnings]
		.map(problem => {
			const sign = signs[problem.level];
			const color = colors[problem.level];
			const decoration = fmt[color](sign);
			const name = chalk.grey(`[${problem.name}]`);
			return `${decoration}   ${problem.message} ${name}`;
		});

	const sign = report.errors.length ? // eslint-disable-line no-nested-ternary
		'✖' :
		report.warnings.length ?
		'⚠' :
		'✔';

	const color = report.errors.length ? // eslint-disable-line no-nested-ternary
		'red' :
		report.warnings.length ?
		'yellow' :
		'green';

	const decoration = fmt[color](sign);
	const summary = `${decoration}   found ${report.errors.length} problems, ${report.warnings.length} warnings`;
	return [...problems, chalk.bold(summary)];
}
