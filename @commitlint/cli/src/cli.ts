import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import util from 'util';

import lint from '@commitlint/lint';
import load from '@commitlint/load';
import read from '@commitlint/read';
import type {
	Formatter,
	LintOptions,
	LintOutcome,
	ParserPreset,
	QualifiedConfig,
	UserConfig,
} from '@commitlint/types';
import type {Options} from 'conventional-commits-parser';
import {execa, type ExecaError} from 'execa';
import resolveFrom from 'resolve-from';
import {resolveGlobalSilent} from 'resolve-global';
import yargs, {type Arguments} from 'yargs';

import {CliFlags} from './types.js';

import {CliError} from './cli-error.js';

const require = createRequire(import.meta.url);

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..');

const dynamicImport = async <T>(id: string): Promise<T> => {
	const imported = await import(
		path.isAbsolute(id) ? pathToFileURL(id).toString() : id
	);
	return ('default' in imported && imported.default) || imported;
};

const pkg: typeof import('../package.json') = require('../package.json');

const gitDefaultCommentChar = '#';

const cli = yargs(process.argv.slice(2))
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
			choices: ['', 'text', 'json'],
			description: 'print resolved config',
			type: 'string',
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
		'git-log-args': {
			description:
				"additional git log arguments as space separated string, example '--first-parent --cherry-pick'",
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
		strict: {
			alias: 's',
			type: 'boolean',
			description:
				'enable strict mode; result code 2 for warnings, 3 for errors',
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

/**
 * avoid description words to be divided in new lines when there is enough space
 * @see https://github.com/conventional-changelog/commitlint/pull/3850#discussion_r1472251234
 */
cli.wrap(cli.terminalWidth());

main(cli.argv).catch((err) => {
	setTimeout(() => {
		if (err.type === pkg.name) {
			process.exit(err.error_code);
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

async function main(args: MainArgs): Promise<void> {
	const options = await resolveArgs(args);
	if (typeof options.edit === 'undefined') {
		options.edit = false;
	}

	const raw = options._;
	const flags = normalizeFlags(options);

	if (typeof options['print-config'] === 'string') {
		const loaded = await load(getSeed(flags), {
			cwd: flags.cwd,
			file: flags.config,
		});

		switch (options['print-config']) {
			case 'json':
				console.log(JSON.stringify(loaded));
				return;

			case 'text':
			default:
				console.log(util.inspect(loaded, false, null, options.color));
				return;
		}
	}

	const fromStdin = checkFromStdin(raw, flags);

	const input = await (fromStdin
		? stdin()
		: read({
				to: flags.to,
				from: flags.from,
				edit: flags.edit,
				cwd: flags.cwd,
				gitLogArgs: flags['git-log-args'],
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
		cli.showHelp('log');
		console.log(err.message);
		throw err;
	}

	const loaded = await load(getSeed(flags), {
		cwd: flags.cwd,
		file: flags.config,
	});
	const parserOpts = selectParserOpts(loaded.parserPreset);
	const opts: LintOptions & {parserOpts: Options} = {
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
	const format = await loadFormatter(loaded, flags);

	// If reading from `.git/COMMIT_EDIT_MSG`, strip comments using
	// core.commentChar from git configuration, falling back to '#'.
	if (flags.edit) {
		try {
			const {stdout} = await execa('git', ['config', 'core.commentChar']);
			opts.parserOpts.commentChar = stdout.trim() || gitDefaultCommentChar;
		} catch (e) {
			const execaError = e as ExecaError;
			// git config returns exit code 1 when the setting is unset,
			// don't warn in this case.
			if (!execaError.failed || execaError.exitCode !== 1) {
				console.warn(
					'Could not determine core.commentChar git configuration',
					e
				);
			}
			opts.parserOpts.commentChar = gitDefaultCommentChar;
		}
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
						'    - Getting started guide: https://commitlint.js.org/guides/getting-started',
						'    - Example config: https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/src/index.ts',
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

	if (flags.strict) {
		if (report.errorCount > 0) {
			throw new CliError(output, pkg.name, 3);
		}
		if (report.warningCount > 0) {
			throw new CliError(output, pkg.name, 2);
		}
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

function loadFormatter(
	config: QualifiedConfig,
	flags: CliFlags
): Promise<Formatter> {
	const moduleName = flags.format || config.formatter || '@commitlint/format';
	const modulePath =
		resolveFrom.silent(__dirname, moduleName) ||
		resolveFrom.silent(flags.cwd, moduleName) ||
		resolveGlobalSilent(moduleName);

	if (modulePath) {
		return dynamicImport<Formatter>(modulePath);
	}

	throw new Error(`Using format ${moduleName}, but cannot find the module.`);
}

// Catch unhandled rejections globally
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
	throw reason;
});
