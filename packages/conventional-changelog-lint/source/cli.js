// polyfills
import 'babel-polyfill';

// npm modules
import chalk from 'chalk';
import meow from 'meow';
import merge from 'lodash.merge';
import pick from 'lodash.pick';
import stdin from 'get-stdin';
import rc from 'rc';

import lint from './';

// Import package for meta data
import pkg from '../package';

/**
 * Behavioural rules
 */
const rules = {
	fromStdin: (input, settings) => input.length === 0 && settings.from === null && settings.to === null
};

// Init meow 😸cli
const cli = meow({
	help: [''],
	description: `${pkg.name}@${pkg.version} - ${pkg.description}`
}, {
	// flags of string type
	string: ['from', 'to', 'preset'],
	// flags of bool type
	boolean: ['edit', 'quiet', 'color'],
	// flag aliases
	alias: {
		c: 'color',
		e: 'edit',
		f: 'from',
		p: 'preset',
		t: 'to',
		q: 'quiet'
	},
	// flag defaults
	default: {
		from: null,
		to: null,
		e: true,
		preset: 'angular',
		quiet: false
	},
	// fail on unknown
	unknown(arg) {
		throw new Error(`unknown flags: ${arg}`);
	}
});

// Get commit messages
// TODO: move this to an own module
async function getMessages(settings) {
	const {from, to, edit} = settings;
	throw new Error(`Reading from git history not supported yet.`);
}

// Resolve extend configs
// TODO: move this to own module
function resolveExtends(config, prefix = '', key = 'extends') {
	return Object.values(config[key] || [])
		.reduce((merged, extender) => {
			const name = [prefix, extender]
				.filter(String)
				.join('-');
			return merge(
				{},
				merged,
				resolveExtends(require(name))
			);
		}, config);
}

// Get linting config
// TODO: move this to own module
function getConfiguration(name, settings) {
	const config = rc(name, settings.defaults);
	return resolveExtends(config, settings.prefix);
}

// Get commit messages
// TODO: move this to an own module
function format(report, options = {}) {
	const {signs, colors, color: enabled} = options;
	const fmt = new chalk.constructor({enabled});

	const problems = [...report.errors, ...report.warnings]
		.map(problem => {
			const sign = signs[problem.level];
			const color = colors[problem.level];
			const decoration = fmt[color](sign);
			const name = chalk.grey(`[${problem.name}]`);
			return `${decoration}   ${problem.message} ${name}`
		});

	const sign = report.errors.length ?
		'✖' :
		report.warnings.length ?
		'⚠' :
		'✔' ;

	const color = report.errors.length ?
		'red' :
		report.warnings.length ?
		'yellow' :
		'green' ;

	const decoration = fmt[color](sign);
	const summary = `${decoration}   found ${report.errors.length} problems, ${report.warnings.length} warnings`;
	return [...problems, chalk.bold(summary)];
}

// Assmeble the engine
async function main(options) {
	const {input: raw, flags} = options;
	const fromStdin = rules.fromStdin(raw, flags);

	const input = fromStdin ?
		await stdin() :
		await getMessages(
			pick(flags, ['edit', 'from', 'to'])
		);

	const results = lint(input, {
		preset: await require(`conventional-changelog-${flags.preset}`),
		configuration: getConfiguration('conventional-changelog-lint', {
			prefix: `conventional-changelog-lint-config`
		})
	});

	const formatted = format(results, {
		color: flags.color,
		signs: [' ', '⚠', '✖'],
		colors: ['white', 'yellow', 'red']
	});

	if (!flags.quiet) {
		console.log(
			formatted
				.join('\n')
		);
	}

	if (results.errors.length > 0) {
		throw new Error(formatted[formatted.length - 1]);
	}
}

// Start the engine
main(cli)
	.catch(error =>
		setTimeout(() => {
			if (error.type === pkg.name) {
				process.exit(1);
			}
			throw error;
		})
	)
