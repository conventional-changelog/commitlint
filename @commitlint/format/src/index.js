import chalk from 'chalk';

const DEFAULT_SIGNS = [' ', '⚠', '✖'];
const DEFAULT_COLORS = ['white', 'yellow', 'red'];

export default function format(report = {}, options = {}) {
	const {results = []} = report;

	if (results.length > 0) {
		return results
			.map(
				result =>
					`${formatInput(result, options)}${formatResult(result, options).join(
						'\n'
					)}`
			)
			.join('\n');
	}

	// Output a summary when nothing is found
	return formatResult({}, options).join('\n');
}

function formatInput(result = {}, options = {}) {
	const {color: enabled = true} = options;
	const {errors = [], input = ''} = result;

	if (!input) {
		return '';
	}

	const sign = '⧗';
	const decoration = enabled ? chalk.gray(sign) : sign;
	const commitText = errors.length > 0 ? `\n${input}\n` : input.split('\n')[0];

	const decoratedInput = enabled ? chalk.bold(commitText) : commitText;

	return `\n${decoration}   input: ${decoratedInput}\n`;
}

function formatResult(result = {}, options = {}) {
	const {
		signs = DEFAULT_SIGNS,
		colors = DEFAULT_COLORS,
		color: enabled = true
	} = options;
	const {errors = [], warnings = []} = result;

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
	const summary = `${decoration}   found ${errors.length} problems, ${
		warnings.length
	} warnings`;
	return [...problems, enabled ? chalk.bold(summary) : summary];
}

function selectSign(result) {
	if (result.errors.length > 0) {
		return '✖';
	}
	return result.warnings.length ? '⚠' : '✔';
}

function selectColor(result) {
	if (result.errors.length > 0) {
		return 'red';
	}
	return result.warnings.length ? 'yellow' : 'green';
}
