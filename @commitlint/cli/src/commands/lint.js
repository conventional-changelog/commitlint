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

	const input = await (fromStdin
		? stdin()
		: core.read(range, {cwd: flags.cwd}));

	const messages = (Array.isArray(input) ? input : [input])
		.filter(message => typeof message === 'string')
		.filter(Boolean);

	if (messages.length === 0 && !checkFromRepository(flags)) {
		throw error(
			'[input] is required: supply via stdin, or --edit or --from and --to',
			{
				quiet: flags.quiet,
				help: true,
				type: pkg.name
			}
		);
	}

	const loaded = await core.load(getSeed(flags), {cwd: flags.cwd});
	const parserOpts = selectParserOpts(loaded.parserPreset);
	const opts = parserOpts ? {parserOpts} : undefined;

	const results = await all(messages, async msg => {
		return {
			report: await core.lint(msg, loaded.rules, opts),
			input: msg
		};
	});

	const valid = results.every(result => result.report.valid);

	if (flags.quiet && valid) {
		return;
	}

	if (flags.quiet && !valid) {
		throw error('linting failed', {type: pkg.name, quiet: true});
	}

	switch (flags.format) {
		case 'commitlint': {
			const fmt = new chalk.constructor({enabled: flags.color});
			const icon = fmt.grey('⧗');
			const formatted = results.map(result => {
				result.formatted = core.format(result.report, {color: flags.color});
				return result;
			});
			formatted.forEach(result => {
				const subject = fmt.bold(result.input.split('\n')[0]);
				console.log(
					`${icon}   input: ${subject}\n${result.formatted.join('\n')}\n`
				);
			});
			break;
		}
		case 'json':
			console.log(JSON.stringify({valid, results}));
			break;
		default: {
			throw error(`unknown format: ${flags.format}`);
		}
	}

	if (!valid) {
		throw error('linting failed', {type: pkg.name, quiet: true});
	}
}

function all(things, predecate) {
	return Promise.all(things.map(thing => predecate(thing)));
}

function error(message, opts = {}) {
	const err = new Error(message);
	Object.assign(err, opts);
	return err;
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
