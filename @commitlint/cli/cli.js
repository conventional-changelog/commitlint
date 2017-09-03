#!/usr/bin/env node
require('babel-polyfill'); // eslint-disable-line import/no-unassigned-import

// npm modules
const core = require('@commitlint/core');
const chalk = require('chalk');
const meow = require('meow');
const pick = require('lodash').pick;
const stdin = require('get-stdin');

const pkg = require('./package');
const help = require('./help');

/**
 * Behavioural rules
 */
const rules = {
	fromStdin: (input, flags) =>
		input.length === 0 &&
		typeof flags.from !== 'string' &&
		typeof flags.to !== 'string' &&
		!flags.edit
};

const configuration = {
	string: ['from', 'to', 'extends', 'parser-preset'],
	boolean: ['edit', 'help', 'version', 'quiet', 'color'],
	alias: {
		c: 'color',
		e: 'edit',
		f: 'from',
		t: 'to',
		q: 'quiet',
		h: 'help',
		v: 'version',
		x: 'extends',
		p: 'parser-preset'
	},
	description: {
		color: 'toggle colored output',
		edit: 'read last commit message found in ./git/COMMIT_EDITMSG',
		extends: 'array of shareable configurations to extend',
		from: 'lower end of the commit range to lint; applies if edit=false',
		to: 'upper end of the commit range to lint; applies if edit=false',
		quiet: 'toggle console output',
		'parser-preset': 'configuration preset to use for conventional-commits-parser'
	},
	default: {
		color: true,
		edit: false,
		from: null,
		to: null,
		quiet: false
	},
	unknown(arg) {
		throw new Error(`unknown flags: ${arg}`);
	}
};

const cli = meow(
	{
		help: `[input] reads from stdin if --edit, --from and --to are omitted\n${help(
			configuration
		)}`,
		description: `${pkg.name}@${pkg.version} - ${pkg.description}`
	},
	configuration
);

const load = seed => core.load(seed);

function main(options) {
	const raw = options.input;
	const flags = options.flags;
	const fromStdin = rules.fromStdin(raw, flags);

	const range = pick(flags, 'edit', 'from', 'to');
	const input = fromStdin ? stdin() : core.read(range);
	const fmt = new chalk.constructor({enabled: flags.color});

	return input.then(raw => (Array.isArray(raw) ? raw : [raw])).then(messages =>
		Promise.all(
			messages.map(commit => {
				return load(getSeed(flags))
					.then(loaded => {
						const parserOpts = selectParserOpts(loaded.parserPreset);
						const opts = parserOpts ? {parserOpts} : undefined;
						return core.lint(commit, loaded.rules, opts);
					})
					.then(report => {
						const formatted = core.format(report, {color: flags.color});

						if (!flags.quiet) {
							console.log(
								`${fmt.grey('⧗')}   input: ${fmt.bold(commit.split('\n')[0])}`
							);
							console.log(formatted.join('\n'));
						}

						if (report.errors.length > 0) {
							const error = new Error(formatted[formatted.length - 1]);
							error.type = pkg.name;
							throw error;
						}
						return console.log('');
					});
			})
		)
	);
}

function getSeed(seed) {
	const e = Array.isArray(seed.extends) ? seed.extends : [seed.extends];
	const n = e.filter(i => typeof i === 'string');
	return n.length > 0
		? {extends: n, parserPreset: seed.parserPreset}
		: {parserPreset: seed.parserPreset};
}

// Start the engine
main(cli).catch(err =>
	setTimeout(() => {
		if (err.type === pkg.name) {
			process.exit(1);
		}
		throw err;
	})
);


function selectParserOpts(parserPreset) {
	if (typeof parserPreset !== 'object') {
		return undefined;
	}

	const opts = parserPreset.opts;

	if (typeof opts !== 'object') {
		return undefined;
	}

	return opts.parserOpts;
}

// Catch unhandled rejections globally
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
	throw reason;
});
