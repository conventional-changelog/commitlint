#!/usr/bin/env node
require('babel-polyfill'); // eslint-disable-line import/no-unassigned-import

const meow = require('meow');
const merge = require('lodash/merge');

const pkg = require('../package');
const commands = require('./commands');

const FORMATS = ['commitlint', 'json'];
const COMMANDS = ['config'];

const HELP = `
Commands
commitlint              lint commits, [input] reads from stdin if --edit, --from and --to are omitted

Options
--cwd, -d              directory to execute in, defaults to: process.cwd()
--extends, -x          array of shareable configurations to extend
--format, -o           format to use, defaults to "commitlint". available: "commitlint", "json"
--parser-preset, -p    configuration preset to use for conventional-commits-parser
--quiet, -q            toggle console output

commitlint
  --color, -c            toggle colored output, defaults to: true
  --edit, -e             read last commit message from the specified file or falls back to ./.git/COMMIT_EDITMSG
  --from, -f             lower end of the commit range to lint; applies if edit=false
  --to, -t               upper end of the commit range to lint; applies if edit=false

Usage
$ echo "some commit" | commitlint
$ commitlint --to=master
$ commitlint --from=HEAD~1
`;

const cli = meow(
	{
		help: HELP,
		description: `${pkg.name}@${pkg.version} - ${pkg.description}`
	},
	{
		string: ['cwd', 'format', 'from', 'to', 'edit', 'extends', 'parser-preset'],
		boolean: ['help', 'version', 'quiet', 'color'],
		alias: {
			c: 'color',
			d: 'cwd',
			e: 'edit',
			f: 'from',
			h: 'help',
			o: 'format',
			p: 'parser-preset',
			q: 'quiet',
			t: 'to',
			v: 'version',
			x: 'extends'
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
			if (COMMANDS.includes(arg)) {
				return;
			}

			console.log(HELP);

			if (!arg.startsWith('-') && !COMMANDS.includes(arg)) {
				console.log(`<command> must be on of: [config], received "${arg}"`);
			} else {
				console.log(`unknown flags: ${arg}`);
			}

			process.exit(1);
		}
	}
);

main(cli).catch(err =>
	setTimeout(() => {
		if (err.quiet) {
			process.exit(1);
		}
		if (err.help) {
			console.log(`${cli.help}\n`);
		}
		if (err.type === pkg.name) {
			console.log(err.message);
			process.exit(1);
		}
		throw err;
	})
);

async function main(options) {
	const raw = Array.isArray(options.input) ? options.input : [];
	const [command] = raw;

	const flags = normalizeFlags(options.flags);

	if (!command) {
		return commands.lint(raw, flags);
	}

	switch (command) {
		case 'config':
			return commands.config(raw, {
				cwd: flags.cwd,
				extends: flags.extends,
				format: flags.format,
				parserPreset: flags.parserPreset
			});
		default: {
			const err = new Error(
				`<command> must be on of: [config], received "${command}"`
			);
			err.help = true;
			err.type = pkg.name;
			throw err;
		}
	}
}

function normalizeFlags(raw) {
	const flags = merge({}, raw);

	// The `edit` flag is either a boolean or a string but we are only allowed
	// to specify one of them in minimist
	if (flags.edit === '') {
		merge(flags, {edit: true, e: true});
	}

	// The recommended method to specify -e with husky is commitlint -e $GIT_PARAMS
	// This does not work properly with win32 systems, where env variable declarations
	// use a different syntax
	// See https://github.com/marionebl/commitlint/issues/103 for details
	if (flags.edit === '$GIT_PARAMS' || flags.edit === '%GIT_PARAMS%') {
		if (!('GIT_PARAMS' in process.env)) {
			throw new Error(
				`Received ${
					flags.edit
				} as value for -e | --edit, but GIT_PARAMS is not available globally.`
			);
		}
		return process.env.GIT_PARAMS;
	}

	if (!('format' in flags)) {
		flags.format = 'commitlint';
	}

	if (!FORMATS.includes(flags.format)) {
		const err = new Error(
			`--format must be on of: [${FORMATS.join(',')}], received "${
				flags.format
			}".`
		);
		err.quiet = flags.quiet;
		err.help = true;
		err.type = pkg.name;
		throw err;
	}

	return flags;
}

// Catch unhandled rejections globally
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
	throw reason;
});
