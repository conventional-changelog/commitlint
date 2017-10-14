#!/usr/bin/env node
require('babel-polyfill'); // eslint-disable-line import/no-unassigned-import

const core = require('@commitlint/core');
const chalk = require('chalk');
const meow = require('meow');
const {merge, pick} = require('lodash');
const stdin = require('get-stdin');

const pkg = require('../package');
const help = require('./help');

const rules = {
	fromStdin: (input, flags) =>
		input.length === 0 &&
		typeof flags.from !== 'string' &&
		typeof flags.to !== 'string' &&
		!flags.edit
};

const configuration = {
	string: ['cwd', 'from', 'to', 'edit', 'extends', 'parser-preset'],
	boolean: ['help', 'version', 'quiet', 'color'],
	alias: {
		c: 'color',
		d: 'cwd',
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
		cwd: 'directory to execute in',
		edit:
			'read last commit message from the specified file or fallbacks to ./.git/COMMIT_EDITMSG',
		extends: 'array of shareable configurations to extend',
		from: 'lower end of the commit range to lint; applies if edit=false',
		to: 'upper end of the commit range to lint; applies if edit=false',
		quiet: 'toggle console output',
		'parser-preset':
			'configuration preset to use for conventional-commits-parser'
	},
	default: {
		color: true,
		cwd: process.cwd(),
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

main(cli).catch(err =>
	setTimeout(() => {
		if (err.type === pkg.name) {
			process.exit(1);
		}
		throw err;
	})
);

async function main(options) {
	const raw = options.input;
	const flags = normalizeFlags(options.flags);
	const fromStdin = rules.fromStdin(raw, flags);

	const range = pick(flags, 'edit', 'from', 'to');
	const fmt = new chalk.constructor({enabled: flags.color});

	const input = await (fromStdin
		? stdin()
		: core.read(range, {cwd: flags.cwd}));
	const messages = Array.isArray(input) ? input : [input];

	return Promise.all(
		messages.map(async message => {
			const loaded = await core.load(getSeed(flags), {cwd: flags.cwd});
			const parserOpts = selectParserOpts(loaded.parserPreset);
			const opts = parserOpts ? {parserOpts} : undefined;
			const report = await core.lint(message, loaded.rules, opts);
			const formatted = core.format(report, {color: flags.color});

			if (!flags.quiet) {
				console.log(
					`${fmt.grey('⧗')}   input: ${fmt.bold(message.split('\n')[0])}`
				);
				console.log(formatted.join('\n'));
			}

			if (report.errors.length > 0) {
				const error = new Error(formatted[formatted.length - 1]);
				error.type = pkg.name;
				throw error;
			}
			console.log('');
		})
	);
}

function normalizeFlags(flags) {
	// The `edit` flag is either a boolean or a string but we are only allowed
	// to specify one of them in minimist
	if (flags.edit === '') {
		return merge({}, flags, {edit: true, e: true});
	}

	return flags;
}

function getSeed(seed) {
	const e = Array.isArray(seed.extends) ? seed.extends : [seed.extends];
	const n = e.filter(i => typeof i === 'string');
	return n.length > 0
		? {extends: n, parserPreset: seed.parserPreset}
		: {parserPreset: seed.parserPreset};
}

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
