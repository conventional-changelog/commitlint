#!/usr/bin/env node
require('babel-polyfill'); // eslint-disable-line import/no-unassigned-import

const format = require('@commitlint/format');
const load = require('@commitlint/load');
const lint = require('@commitlint/lint');
const read = require('@commitlint/read');
const chalk = require('chalk');
const meow = require('meow');
const merge = require('lodash.merge');
const pick = require('lodash.pick');
const stdin = require('get-stdin');

const pkg = require('../package');
const help = require('./help');

const configuration = {
	string: ['cwd', 'from', 'to', 'edit', 'extends', 'parser-preset', 'config'],
	boolean: ['help', 'version', 'quiet', 'color'],
	alias: {
		c: 'color',
		d: 'cwd',
		e: 'edit',
		f: 'from',
		t: 'to',
		q: 'quiet',
		h: 'help',
		g: 'config',
		v: 'version',
		x: 'extends',
		p: 'parser-preset'
	},
	description: {
		color: 'toggle colored output',
		cwd: 'directory to execute in',
		config: 'path to the config file',
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
		config: null,
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
	const fromStdin = checkFromStdin(raw, flags);

	const range = pick(flags, 'edit', 'from', 'to');
	const fmt = new chalk.constructor({enabled: flags.color});

	const input = await (fromStdin ? stdin() : read(range, {cwd: flags.cwd}));

	const messages = (Array.isArray(input) ? input : [input])
		.filter(message => typeof message === 'string')
		.filter(Boolean);

	if (messages.length === 0 && !checkFromRepository(flags)) {
		const err = new Error(
			'[input] is required: supply via stdin, or --edit or --from and --to'
		);
		err.type = pkg.name;
		console.log(`${cli.help}\n`);
		console.log(err.message);
		throw err;
	}

	const loadOpts = {cwd: flags.cwd, file: flags.config};
	const loaded = await load(getSeed(flags), loadOpts);
	const parserOpts = selectParserOpts(loaded.parserPreset);
	const opts = parserOpts ? {parserOpts} : {parserOpts: {}};

	// Strip comments if reading from `.git/COMMIT_EDIT_MSG`
	if (range.edit) {
		opts.parserOpts.commentChar = '#';
	}

	return Promise.all(
		messages.map(async message => {
			const report = await lint(message, loaded.rules, opts);
			const formatted = format(report, {color: flags.color});

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

function checkFromStdin(input, flags) {
	return input.length === 0 && !checkFromRepository(flags);
}

function checkFromRepository(flags) {
	return checkFromHistory(flags) || checkFromEdit(flags);
}

function checkFromEdit(flags) {
	return Boolean(flags.edit);
}

function checkFromHistory(flags) {
	return typeof flags.from === 'string' || typeof flags.to === 'string';
}

function normalizeFlags(flags) {
	// The `edit` flag is either a boolean or a string but we are only allowed
	// to specify one of them in minimist
	const edit = flags.edit === '' ? true : normalizeEdit(flags.edit);
	return merge({}, flags, {edit, e: edit});
}

function normalizeEdit(edit) {
	if (typeof edit === 'boolean') {
		return edit;
	}
	// The recommended method to specify -e with husky is commitlint -e $GIT_PARAMS
	// This does not work properly with win32 systems, where env variable declarations
	// use a different syntax
	// See https://github.com/marionebl/commitlint/issues/103 for details
	if (edit === '$GIT_PARAMS' || edit === '%GIT_PARAMS%') {
		if (!('GIT_PARAMS' in process.env)) {
			throw new Error(
				`Received ${edit} as value for -e | --edit, but GIT_PARAMS is not available globally.`
			);
		}
		return process.env.GIT_PARAMS;
	}
	return edit;
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

	if (typeof parserPreset.parserOpts !== 'object') {
		return undefined;
	}

	return parserPreset.parserOpts;
}

// Catch unhandled rejections globally
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
	throw reason;
});
