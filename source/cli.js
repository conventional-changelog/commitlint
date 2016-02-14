#!/usr/bin/env node
// polyfills
import 'babel-polyfill';

// npm modules
import chalk from 'chalk';
import meow from 'meow';
import pick from 'lodash.pick';
import stdin from 'get-stdin';

// local modules
import help from './help';
import lint from './';
import {
	format,
	getConfiguration,
	getPreset,
	getMessages
} from './';

import pkg from '../package';

/**
 * Behavioural rules
 */
const rules = {
	fromStdin: (input, flags) => input.length === 0 &&
		flags.from === null &&
		flags.to === null &&
		!flags.edit
};

const configuration = {
	// flags of string type
	string: ['from', 'to', 'preset', 'extends'],
	// flags of array type
	// flags of bool type
	boolean: ['edit', 'help', 'version', 'quiet', 'color'],
	// flag aliases
	alias: {
		c: 'color',
		e: 'edit',
		f: 'from',
		p: 'preset',
		t: 'to',
		q: 'quiet',
		h: 'help',
		v: 'version',
		x: 'extends'
	},
	description: {
		color: 'toggle formatted output',
		edit: 'read last commit message found in ./git/COMMIT_EDITMSG',
		'extends': 'array of shareable configurations to extend',
		from: 'lower end of the commit range to lint; applies if edit=false',
		preset: 'conventional-changelog-preset to use for commit message parsing',
		to: 'upper end of the commit range to lint; applies if edit=false',
		quiet: 'toggle console output'
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
};

// Init meow 😸cli
const cli = meow({
	help: `[input] reads from stdin if --edit, --from, --to are omitted\n${help(configuration)}`,
	description: `${pkg.name}@${pkg.version} - ${pkg.description}`
}, configuration);

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
			const fmt = new chalk.constructor({enabled: flags.color});

			const seed = {};
			if (flags.extends) {
				seed.extends = flags.extends.split(',');
			}

			const report = lint(commit, {
				preset: await getPreset(flags.preset),
				configuration: await getConfiguration(
					'conventional-changelog-lint',
					{
						prefix: 'conventional-changelog-lint-config'
					},
					seed
				)
			});

			const formatted = format(report, {
				color: flags.color,
				signs: [' ', '⚠', '✖'],
				colors: ['white', 'yellow', 'red']
			});

			if (!flags.quiet) {
				console.log(`${fmt.grey('⧗')}   input: ${fmt.bold(commit.split('\n')[0])}`);
				console.log(
					formatted
						.join('\n')
				);
			}

			if (report.errors.length > 0) {
				const error = new Error(formatted[formatted.length - 1]);
				error.type = pkg.name;
				throw error;
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
