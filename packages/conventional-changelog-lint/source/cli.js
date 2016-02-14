// polyfills
import 'babel-polyfill';

// core modules
import {
	readFile as readFileNodeback
} from 'fs';

// npm modules
import chalk from 'chalk';
import denodeify from 'denodeify';
import gitRawCommits from 'git-raw-commits';
import meow from 'meow';
import merge from 'lodash.merge';
import pick from 'lodash.pick';
import stdin from 'get-stdin';
import rc from 'rc';

// local modules
import lint from './';
import pkg from '../package';

// denodeifications
const readFile = denodeify(readFileNodeback);

/**
 * Behavioural rules
 */
const rules = {
	fromStdin: (input, settings) => input.length === 0 &&
		settings.from === null &&
		settings.to === null &&
		settings.edit === null
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
		color: true,
		edit: false,
		from: null,
		preset: 'angular',
		to: null,
		quiet: false
	},
	// fail on unknown
	unknown(arg) {
		throw new Error(`unknown flags: ${arg}`);
	}
});

// Get commit messages
// TODO: move this to an own moduleddd
function getCommits(options) {
	return new Promise((resolve, reject) => {
		const data = [];
		gitRawCommits(options)
		.on('data', chunk => data.push(chunk.toString('utf-8')))
		.on('error', reject)
		.on('end', () => {
			resolve(data);
		});
	});
}

// Get commit messages
// TODO: move this to an own module
async function getMessages(settings) {
	const {from, to, edit} = settings;

	if (edit) {
		const editFile = await readFile(`.git/COMMIT_EDITMSG`);
		return [editFile.toString('utf-8')];
	} else {
		return await getCommits({
			from,
			to
		});
	}
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

// Assemble the engine
async function main(options) {
	const {input: raw, flags} = options;
	const fromStdin = rules.fromStdin(raw, flags);

	const input = fromStdin ?
		[await stdin()] :
		await getMessages(
			pick(flags, ['edit', 'from', 'to'])
		);

	return Promise.all(input
		.map(async commit => {
			const report = lint(commit, {
				preset: await require(`conventional-changelog-${flags.preset}`),
				configuration: getConfiguration('conventional-changelog-lint', {
					prefix: `conventional-changelog-lint-config`
				})
			});

			const formatted = format(report, {
				color: flags.color,
				signs: [' ', '⚠', '✖'],
				colors: ['white', 'yellow', 'red']
			});

			if (!flags.quiet) {
				console.log(`validating: ${commit.split('\n')[0]}`);
				console.log(
					formatted
						.join('\n')
				);
			}

			if (report.errors.length > 0) {
				throw new Error(formatted[formatted.length - 1]);
			}

			console.log('');
		}));
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
