import util from 'util';
import isIgnored from '@commitlint/is-ignored';
import parse from '@commitlint/parse';
import defaultRules from '@commitlint/rules';
import {buildCommitMesage} from './commit-message';
import {
	LintOptions,
	LintOutcome,
	LintRuleOutcome,
	Rule,
<<<<<<< HEAD
	RuleSeverity,
	BaseRule,
	RuleType
||||||| f74e036
	RuleSeverity
=======
	RuleConfigSeverity,
	QualifiedRules
>>>>>>> armano2/refactor-cli
} from '@commitlint/types';

export default async function lint(
	message: string,
	rawRulesConfig?: QualifiedRules,
	rawOpts?: LintOptions
): Promise<LintOutcome> {
	const opts = rawOpts
		? rawOpts
		: {defaultIgnores: undefined, ignores: undefined};
	const rulesConfig = rawRulesConfig || {};

	// Found a wildcard match, skip
	if (
		isIgnored(message, {defaults: opts.defaultIgnores, ignores: opts.ignores})
	) {
		return {
			valid: true,
			errors: [],
			warnings: [],
			input: message
		};
	}

	// Parse the commit message
	const parsed =
		message === ''
			? {header: null, body: null, footer: null}
			: await parse(message, undefined, opts.parserOpts);

	if (
		parsed.header === null &&
		parsed.body === null &&
		parsed.footer === null
	) {
		// Commit is empty, skip
		return {
			valid: true,
			errors: [],
			warnings: [],
			input: message
		};
	}

	const allRules: Map<string, BaseRule<never, RuleType>> = new Map(
		Object.entries(defaultRules)
	);

	if (opts.plugins) {
		Object.values(opts.plugins).forEach(plugin => {
			if (plugin.rules) {
				Object.keys(plugin.rules).forEach(ruleKey =>
					allRules.set(ruleKey, plugin.rules[ruleKey])
				);
			}
		});
	}

	// Find invalid rules configs
	const missing = Object.keys(rulesConfig).filter(
		name => typeof allRules.get(name) !== 'function'
	);

	if (missing.length > 0) {
		const names = [...allRules.keys()];
		throw new RangeError(
			`Found invalid rule names: ${missing.join(
				', '
			)}. Supported rule names are: ${names.join(', ')}`
		);
	}

	const invalid = Object.entries(rulesConfig)
		.map(([name, config]) => {
			if (!Array.isArray(config)) {
				return new Error(
					`config for rule ${name} must be array, received ${util.inspect(
						config
					)} of type ${typeof config}`
				);
			}

			const [level] = config;

			if (level === RuleConfigSeverity.Disabled && config.length === 1) {
				return null;
			}

			const [, when] = config;

			if (typeof level !== 'number' || isNaN(level)) {
				return new Error(
					`level for rule ${name} must be number, received ${util.inspect(
						level
					)} of type ${typeof level}`
				);
			}

			if (config.length !== 2 && config.length !== 3) {
				return new Error(
					`config for rule ${name} must be 2 or 3 items long, received ${util.inspect(
						config
					)} of length ${config.length}`
				);
			}

			if (level < 0 || level > 2) {
				return new RangeError(
					`level for rule ${name} must be between 0 and 2, received ${util.inspect(
						level
					)}`
				);
			}

			if (typeof when !== 'string') {
				return new Error(
					`condition for rule ${name} must be string, received ${util.inspect(
						when
					)} of type ${typeof when}`
				);
			}

			if (when !== 'never' && when !== 'always') {
				return new Error(
					`condition for rule ${name} must be "always" or "never", received ${util.inspect(
						when
					)}`
				);
			}

			return null;
		})
		.filter((item): item is Error => item instanceof Error);

	if (invalid.length > 0) {
		throw new Error(invalid.map(i => i.message).join('\n'));
	}

	// Validate against all rules
<<<<<<< HEAD
	const pendingResults = Object.entries(rulesConfig)
		.filter(([, [level]]) => level > 0)
		.map(async entry => {
||||||| f74e036
	const results = Object.entries(rulesConfig)
		.filter(([, [level]]) => level > 0)
		.map(entry => {
=======
	const results = Object.entries(rulesConfig)
		.filter(([, config]) => typeof config !== 'undefined' && config[0] > 0)
		.map(entry => {
>>>>>>> armano2/refactor-cli
			const [name, config] = entry;
			const [level, when, value] = config!; //

			// Level 0 rules are ignored
			if (level === 0) {
				return null;
			}

			const rule = allRules.get(name);

			if (!rule) {
				throw new Error(`Could not find rule implementation for ${name}`);
			}

<<<<<<< HEAD
			const executableRule = rule as Rule<unknown>;
			const [valid, message] = await executableRule(parsed, when, value);
||||||| f74e036
			const executableRule = rule as Rule<unknown>;
			const [valid, message] = executableRule(parsed, when, value);
=======
			const [valid, message] = rule(parsed, when, value as any);
>>>>>>> armano2/refactor-cli

			return {
				level,
				valid,
				name,
				message
			};
		});

	const results = (await Promise.all(pendingResults)).filter(
		(result): result is LintRuleOutcome => result !== null
	);

	const errors = results.filter(result => result.level === 2 && !result.valid);
	const warnings = results.filter(
		result => result.level === 1 && !result.valid
	);

	const valid = errors.length === 0;

	return {
		valid,
		errors,
		warnings,
		input: buildCommitMesage(parsed)
	};
}
