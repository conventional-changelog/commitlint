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

const flags = {
	color: {
		alias: 'c',
		default: true,
		description: 'toggle colored output',
		type: 'boolean'
	},
	config: {
		alias: 'g',
		default: null,
		description: 'path to the config file',
		type: 'string'
	},
	cwd: {
		alias: 'd',
		default: process.cwd(),
		description: 'directory to execute in',
		type: 'string'
	},
	edit: {
		alias: 'e',
		default: false,
		description:
			'read last commit message from the specified file or fallbacks to ./.git/COMMIT_EDITMSG',
		type: 'string'
	},
	extends: {
		alias: 'x',
		description: 'array of shareable configurations to extend',
		type: 'string'
	},
	help: {
		alias: 'h',
		type: 'boolean'
	},
	from: {
		alias: 'f',
		default: null,
		description: 'lower end of the commit range to lint; applies if edit=false',
		type: 'string'
	},
	'parser-preset': {
		alias: 'p',
		description: 'configuration preset to use for conventional-commits-parser',
		type: 'string'
	},
	quiet: {
		alias: 'q',
		default: false,
		description: 'toggle console output',
		type: 'boolean'
	},
	to: {
		alias: 't',
		default: null,
		description: 'upper end of the commit range to lint; applies if edit=false',
		type: 'string'
	},
	version: {
		alias: 'v',
		type: 'boolean'
	}
};

const cli = meow({
	description: `${pkg.name}@${pkg.version} - ${pkg.description}`,
	flags,
	help: `[input] reads from stdin if --edit, --from and --to are omitted\n${help(
		flags
	)}`,
	unknown(arg) {
		throw new Error(`unknown flags: ${arg}`);
	}
});

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
			const input =
				report.errors.length > 0
					? `\n${report.input}\n`
					: message.split('\n')[0];

			if (!flags.quiet) {
				console.log(`${fmt.grey('⧗')}   input: ${fmt.bold(input)}`);
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
