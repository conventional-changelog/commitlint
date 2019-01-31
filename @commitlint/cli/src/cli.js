#!/usr/bin/env node
require('babel-polyfill'); // eslint-disable-line import/no-unassigned-import

const load = require('@commitlint/load');
const lint = require('@commitlint/lint');
const read = require('@commitlint/read');
const meow = require('meow');
const {merge, pick} = require('lodash');
const stdin = require('get-stdin');
const resolveFrom = require('resolve-from');
const resolveGlobal = require('resolve-global');

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
	env: {
		alias: 'E',
		default: null,
		description:
			'check message in the file at path given by environment variable value',
		type: 'string'
	},
	extends: {
		alias: 'x',
		description: 'array of shareable configurations to extend',
		type: 'string'
	},
	help: {
		alias: 'h',
		type: 'boolean',
		description: 'display this help message'
	},
	from: {
		alias: 'f',
		default: null,
		description: 'lower end of the commit range to lint; applies if edit=false',
		type: 'string'
	},
	format: {
		alias: 'o',
		default: null,
		description: 'output format of the results',
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
		type: 'boolean',
		description: 'display version information'
	}
};

const cli = meow({
	description: `${pkg.name}@${pkg.version} - ${pkg.description}`,
	flags,
	help: `[input] reads from stdin if --edit, --env, --from and --to are omitted\n${help(
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

	const input = await (fromStdin ? stdin() : read(range, {cwd: flags.cwd}));

	const messages = (Array.isArray(input) ? input : [input])
		.filter(message => typeof message === 'string')
		.filter(message => message.trim() !== '')
		.filter(Boolean);

	if (messages.length === 0 && !checkFromRepository(flags)) {
		const err = new Error(
			'[input] is required: supply via stdin, or --env or --edit or --from and --to'
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
	const format = loadFormatter(loaded, flags);

	// Strip comments if reading from `.git/COMMIT_EDIT_MSG`
	if (range.edit) {
		opts.parserOpts.commentChar = '#';
	}

	const results = await Promise.all(
		messages.map(message => lint(message, loaded.rules, opts))
	);

	if (Object.keys(loaded.rules).length === 0) {
		let input = '';

		if (results.length !== 0) {
			const originalInput = results[0].input;
			input = originalInput;
		}

		results.splice(0, results.length, {
			valid: false,
			errors: [
				{
					level: 2,
					valid: false,
					name: 'empty-rules',
					message: [
						'Please add rules to your `commitlint.config.js`',
						'    - Getting started guide: https://git.io/fpUzJ',
						'    - Example config: https://git.io/fpUzm'
					].join('\n')
				}
			],
			warnings: [],
			input
		});
	}

	const report = results.reduce(
		(info, result) => {
			info.valid = result.valid ? info.valid : false;
			info.errorCount += result.errors.length;
			info.warningCount += result.warnings.length;
			info.results.push(result);

			return info;
		},
		{
			valid: true,
			errorCount: 0,
			warningCount: 0,
			results: []
		}
	);

	const output = format(report, {color: flags.color});

	if (!flags.quiet) {
		console.log(output);
	}

	if (!report.valid) {
		const err = new Error(output);
		err.type = pkg.name;
		throw err;
	}
}

function checkFromStdin(input, flags) {
	return input.length === 0 && !checkFromRepository(flags);
}

function checkFromRepository(flags) {
	return checkFromHistory(flags) || checkFromEdit(flags);
}

function checkFromEdit(flags) {
	return Boolean(flags.edit) || flags.env;
}

function checkFromHistory(flags) {
	return typeof flags.from === 'string' || typeof flags.to === 'string';
}

function normalizeFlags(flags) {
	const edit = getEditValue(flags);
	return merge({}, flags, {edit, e: edit});
}

function getEditValue(flags) {
	if (flags.env) {
		if (!(flags.env in process.env)) {
			throw new Error(
				`Recieved '${
					flags.env
				}' as value for -E | --env, but environment variable '${
					flags.env
				}' is not available globally`
			);
		}
		return process.env[flags.env];
	}
	const {edit} = flags;
	// If the edit flag is set but empty (i.e '-e') we default
	// to .git/COMMIT_EDITMSG
	if (edit === '') {
		return true;
	}
	if (typeof edit === 'boolean') {
		return edit;
	}
	// The recommended method to specify -e with husky was `commitlint -e $HUSKY_GIT_PARAMS`
	// This does not work properly with win32 systems, where env variable declarations
	// use a different syntax
	// See https://github.com/conventional-changelog/commitlint/issues/103 for details
	// This has been superceded by the `-E GIT_PARAMS` / `-E HUSKY_GIT_PARAMS`
	const isGitParams = edit === '$GIT_PARAMS' || edit === '%GIT_PARAMS%';
	const isHuskyParams =
		edit === '$HUSKY_GIT_PARAMS' || edit === '%HUSKY_GIT_PARAMS%';

	if (isGitParams || isHuskyParams) {
		console.warn(`Using environment variable syntax (${edit}) in -e |\
--edit is deprecated. Use '{-E|--env} HUSKY_GIT_PARAMS instead'`);

		if (isGitParams && 'GIT_PARAMS' in process.env) {
			return process.env.GIT_PARAMS;
		}
		if ('HUSKY_GIT_PARAMS' in process.env) {
			return process.env.HUSKY_GIT_PARAMS;
		}
		throw new Error(
			`Received ${edit} as value for -e | --edit, but GIT_PARAMS or HUSKY_GIT_PARAMS are not available globally.`
		);
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

function loadFormatter(config, flags) {
	const moduleName = flags.format || config.formatter || '@commitlint/format';
	const modulePath =
		resolveFrom.silent(__dirname, moduleName) ||
		resolveFrom.silent(flags.cwd, moduleName) ||
		resolveGlobal.silent(moduleName);

	if (modulePath) {
		return require(modulePath);
	}

	throw new Error(`Using format ${moduleName}, but cannot find the module.`);
}

// Catch unhandled rejections globally
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
	throw reason;
});
