#!/usr/bin/env node
require('babel-polyfill'); // eslint-disable-line import/no-unassigned-import

const meow = require('meow');
const merge = require('lodash/merge');

const pkg = require('../package');
const commands = require('./commands');

const cli = meow(
	{
		help: `
		Commands
		  commitlint              lint commits, [input] reads from stdin if --edit, --from and --to are omitted

		Options
		  --cwd, -d              directory to execute in, defaults to: process.cwd()
		  --extends, -x          array of shareable configurations to extend
		  --parser-preset, -p    configuration preset to use for conventional-commits-parser
		  --quiet, -q            toggle console output

		  commitlint
		    --color, -c            toggle colored output, defaults to: true
		    --edit, -e             read last commit message from the specified file or fallbacks to ./.git/COMMIT_EDITMSG
		    --from, -f             lower end of the commit range to lint; applies if edit=false
		    --to, -t               upper end of the commit range to lint; applies if edit=false

		Usage
		  $ echo "some commit" | commitlint
		  $ commitlint --to=master
		  $ commitlint --from=HEAD~1
		`,
		description: `${pkg.name}@${pkg.version} - ${pkg.description}`
	},
	{
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
		default: {
			color: true,
			cwd: process.cwd(),
			edit: false,
			from: null,
			to: null,
			quiet: false
		},
		unknown(arg) {
			console.log(`unknown flags: ${arg}`);
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

	if (!command) {
		return commands.lint(raw, normalizeFlags(options.flags));
	}
}

function normalizeFlags(flags) {
	// The `edit` flag is either a boolean or a string but we are only allowed
	// to specify one of them in minimist
	if (flags.edit === '') {
		return merge({}, flags, {edit: true, e: true});
	}

	return flags;
}

// Catch unhandled rejections globally
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
	throw reason;
});
