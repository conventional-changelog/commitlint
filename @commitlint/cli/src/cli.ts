import load from '@commitlint/load';
import lint from '@commitlint/lint';
import read from '@commitlint/read';
import isFunction from 'lodash/isFunction';
import resolveFrom from 'resolve-from';
import resolveGlobal from 'resolve-global';
import yargs, {Arguments} from 'yargs';
import util from 'util';

import {CliFlags} from './types';
import {
	LintOptions,
	LintOutcome,
	ParserOptions,
	ParserPreset,
	QualifiedConfig,
	Formatter,
	UserConfig,
} from '@commitlint/types';
import {CliError} from './cli-error';

const pkg = require('../package');

const cli = yargs
	.options({
		color: {
			alias: 'c',
			default: true,
			description: 'toggle colored output',
			type: 'boolean',
		},
		config: {
			alias: 'g',
			description: 'path to the config file',
			type: 'string',
		},
		'print-config': {
			type: 'boolean',
			default: false,
			description: 'print resolved config',
		},
		cwd: {
			alias: 'd',
			default: process.cwd(),
			defaultDescription: '(Working Directory)',
			description: 'directory to execute in',
			type: 'string',
		},
		edit: {
			alias: 'e',
			description:
				'read last commit message from the specified file or fallbacks to ./.git/COMMIT_EDITMSG',
			type: 'string',
		},
		env: {
			alias: 'E',
			description:
				'check message in the file at path given by environment variable value',
			type: 'string',
		},
		extends: {
			alias: 'x',
			description: 'array of shareable configurations to extend',
			type: 'array',
		},
		'help-url': {
			alias: 'H',
			type: 'string',
			description: 'help url in error message',
		},
		from: {
			alias: 'f',
			description:
				'lower end of the commit range to lint; applies if edit=false',
			type: 'string',
		},
		format: {
			alias: 'o',
			description: 'output format of the results',
			type: 'string',
		},
		'parser-preset': {
			alias: 'p',
			description:
				'configuration preset to use for conventional-commits-parser',
			type: 'string',
		},
		quiet: {
			alias: 'q',
			default: false,
			description: 'toggle console output',
			type: 'boolean',
		},
		to: {
			alias: 't',
			description:
				'upper end of the commit range to lint; applies if edit=false',
			type: 'string',
		},
		verbose: {
			alias: 'V',
			type: 'boolean',
			description: 'enable verbose output for reports without problems',
		},
	})
	.version(
		'version',
		'display version information',
		`${pkg.name}@${pkg.version}`
	)
	.alias('v', 'version')
	.help('help')
	.alias('h', 'help')
	.usage(`${pkg.name}@${pkg.version} - ${pkg.description}\n`)
	.usage(
		`[input] reads from stdin if --edit, --env, --from and --to are omitted`
	)
	.strict();

main(cli.argv).catch((err) => {
	setTimeout(() => {
		if (err.type === pkg.name) {
			process.exit(1);
		}
		throw err;
	}, 0);
});

async function stdin() {
	let result = '';

	if (process.stdin.isTTY) {
		return result;
	}

	process.stdin.setEncoding('utf8');

	for await (const chunk of process.stdin) {
		result += chunk;
	}

	return result;
}

type MainArgsObject = {
	[key in keyof Arguments<CliFlags>]: Arguments<CliFlags>[key];
};
type MainArgsPromise = Promise<MainArgsObject>;
type MainArgs = MainArgsObject | MainArgsPromise;

async function resolveArgs(args: MainArgs): Promise<MainArgsObject> {
	return typeof args.then === 'function' ? await args : args;
}

async function main(args: MainArgs) {
	const options = await resolveArgs(args);
	if (typeof options.edit === 'undefined') {
		options.edit = false;
	}

	const raw = options._;
	const flags = normalizeFlags(options);

	if (flags['print-config']) {
		const loaded = await load(getSeed(flags), {
			cwd: flags.cwd,
			file: flags.config,
		});
		console.log(util.inspect(loaded, false, null, options.color));
		return;
	}

	const fromStdin = checkFromStdin(raw, flags);

	const input = await (fromStdin
		? stdin()
		: read({
				to: flags.to,
				from: flags.from,
				edit: flags.edit,
				cwd: flags.cwd,
		  }));

	const messages = (Array.isArray(input) ? input : [input])
		.filter((message) => typeof message === 'string')
		.filter((message) => message.trim() !== '')
		.filter(Boolean);

	if (messages.length === 0 && !checkFromRepository(flags)) {
		const err = new CliError(
			'[input] is required: supply via stdin, or --env or --edit or --from and --to',
			pkg.name
		);
		yargs.showHelp('log');
		console.log(err.message);
		throw err;
	}

	const loaded = await load(getSeed(flags), {
		cwd: flags.cwd,
		file: flags.config,
	});
	const parserOpts = selectParserOpts(loaded.parserPreset);
	const opts: LintOptions & {parserOpts: ParserOptions} = {
		parserOpts: {},
		plugins: {},
		ignores: [],
		defaultIgnores: true,
	};
	if (parserOpts) {
		opts.parserOpts = parserOpts;
	}
	if (loaded.plugins) {
		opts.plugins = loaded.plugins;
	}
	if (loaded.ignores) {
		opts.ignores = loaded.ignores;
	}
	if (loaded.defaultIgnores === false) {
		opts.defaultIgnores = false;
	}
	const format = loadFormatter(loaded, flags);

	// Strip comments if reading from `.git/COMMIT_EDIT_MSG` using the
	// commentChar from the parser preset falling back to a `#` if that is not
	// set
	if (flags.edit && typeof opts.parserOpts.commentChar !== 'string') {
		opts.parserOpts.commentChar = '#';
	}

	const results = await Promise.all(
		messages.map((message) => lint(message, loaded.rules, opts))
	);

	if (Object.keys(loaded.rules).length === 0) {
		let input = '';

		if (results.length !== 0) {
			input = results[0].input;
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
						'    - Getting started guide: https://git.io/fhHij',
						'    - Example config: https://git.io/fhHip',
					].join('\n'),
				},
			],
			warnings: [],
			input,
		});
	}

	const report = results.reduce<{
		valid: boolean;
		errorCount: number;
		warningCount: number;
		results: LintOutcome[];
	}>(
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
			results: [],
		}
	);

	const helpUrl = flags['help-url']?.trim() || loaded.helpUrl;

	const output = format(report, {
		color: flags.color,
		verbose: flags.verbose,
		helpUrl,
	});

	if (!flags.quiet && output !== '') {
		console.log(output);
	}

	if (!report.valid) {
		throw new CliError(output, pkg.name);
	}
}

function checkFromStdin(input: (string | number)[], flags: CliFlags): boolean {
	return input.length === 0 && !checkFromRepository(flags);
}

function checkFromRepository(flags: CliFlags): boolean {
	return checkFromHistory(flags) || checkFromEdit(flags);
}

function checkFromEdit(flags: CliFlags): boolean {
	return Boolean(flags.edit) || Boolean(flags.env);
}

function checkFromHistory(flags: CliFlags): boolean {
	return typeof flags.from === 'string' || typeof flags.to === 'string';
}

function normalizeFlags(flags: CliFlags): CliFlags {
	const edit = getEditValue(flags);
	return {
		...flags,
		edit,
	};
}

function getEditValue(flags: CliFlags) {
	if (flags.env) {
		if (!(flags.env in process.env)) {
			throw new Error(
				`Received '${flags.env}' as value for -E | --env, but environment variable '${flags.env}' is not available globally`
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

function getSeed(flags: CliFlags): UserConfig {
	const n = (flags.extends || []).filter(
		(i): i is string => typeof i === 'string'
	);
	return n.length > 0
		? {extends: n, parserPreset: flags['parser-preset']}
		: {parserPreset: flags['parser-preset']};
}

function selectParserOpts(parserPreset: ParserPreset | undefined) {
	if (typeof parserPreset !== 'object') {
		return undefined;
	}

	if (typeof parserPreset.parserOpts !== 'object') {
		return undefined;
	}

	return parserPreset.parserOpts;
}

function loadFormatter(config: QualifiedConfig, flags: CliFlags): Formatter {
	const moduleName = flags.format || config.formatter || '@commitlint/format';
	const modulePath =
		resolveFrom.silent(__dirname, moduleName) ||
		resolveFrom.silent(flags.cwd, moduleName) ||
		resolveGlobal.silent(moduleName);

	if (modulePath) {
		const moduleInstance = require(modulePath);

		if (isFunction(moduleInstance.default)) {
			return moduleInstance.default;
		}

		return moduleInstance;
	}

	throw new Error(`Using format ${moduleName}, but cannot find the module.`);
}

// Catch unhandled rejections globally
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
	throw reason;
});
