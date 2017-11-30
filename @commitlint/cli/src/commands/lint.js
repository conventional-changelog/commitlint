const core = require('@commitlint/core');
const chalk = require('chalk');
const pick = require('lodash/pick');
const stdin = require('get-stdin');

const pkg = require('../../package');
const getSeed = require('./get-seed').getSeed;

module.exports.lint = lint;

async function lint(rawInput, flags) {
	const fromStdin = checkFromStdin(rawInput, flags);

	const range = pick(flags, 'edit', 'from', 'to');
	const fmt = new chalk.constructor({enabled: flags.color});

	const input = await (fromStdin
		? stdin()
		: core.read(range, {cwd: flags.cwd}));

	const messages = (Array.isArray(input) ? input : [input])
		.filter(message => typeof message === 'string')
		.filter(Boolean);

	if (messages.length === 0 && !checkFromRepository(flags)) {
		const err = new Error(
			'[input] is required: supply via stdin, or --edit or --from and --to'
		);
		err.help = true;
		err.type = pkg.name;
		throw err;
	}

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
