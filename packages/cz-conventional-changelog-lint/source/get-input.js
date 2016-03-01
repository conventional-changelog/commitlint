import chalk from 'chalk';
import {getPreset, getConfiguration} from 'conventional-changelog-lint';
import {merge} from 'lodash';
import vorpal from 'vorpal';

/**
 * Get prefix for a given rule id
 * @param  {string} id of the rule
 * @return {string} prefix of the rule
 */
function getRulePrefix(id) {
	const fragments = id.split('-');
	const [prefix] = fragments;
	return fragments.length > 1 ?
		prefix :
		null;
}

/**
 * Get name for a given rule id
 * @param  {string} id of the rule
 * @return {[type]} name of the rule
 */
function getRuleName(id) {
	const fragments = id.split('-');
	return fragments.length > 1 ?
		fragments.slice(1).join('-') :
		fragments[0];
}

/**
 * Get a predecate matching rule definitions with a given prefix
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function getHasPrefix(name) {
	return rule => getRulePrefix(rule[0]) === name;
}

/**
 * Get a predecate matching rule definitions with a given name
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function getHasName(name) {
	return rule => getRuleName(rule[0]) === name;
}

/**
 * Get rules for a given prefix
 * @param  {string} prefix to search in rule names
 * @param  {object} rules  rules to search in
 * @return {object}        rules matching the prefix search
 */
function getRules(prefix, rules) {
	return Object.entries(rules).filter(getHasPrefix(prefix));
}

/**
 * Check if a rule definition is active
 * @param {object} rule to check
 * @return {boolean} if the rule definition is active
 */
function ruleIsActive(rule) {
	const [, [severity]] = rule;
	return severity > 0;
}

/**
 * Check if a rule definition is applicable
 * @param {object} rule to check
 * @return {boolean} if the rule definition is appliable
 */
function ruleIsApplicable(rule) {
	const [, [, applicable]] = rule;
	return applicable === 'always';
}

/**
 * [enumRuleIsActive description]
 * @param  {[type]} rule [description]
 * @return {[type]}      [description]
 */
function enumRuleIsActive(rule) {
	const [, [, , value]] = rule;
	return ruleIsActive(rule) &&
		ruleIsApplicable(rule) &&
		value.length > 0;
}

/**
 * Get formatted meta hints for configuration
 * @param  {object} settings dictionary to parse
 * @return {string}          formatted meta information
 */
function meta(settings) {
	return chalk.grey(Object.entries(settings)
		.filter(item => item[1])
		.map(item => {
			const [name, value] = item;
			return typeof value === 'boolean' ?
				`[${name}]` :
				`[${name}=${value}]`;
		})
		.join(' '));
}

/**
 * Get forced case for rule
 * @param {object} rule to parse
 * @return {string|null} transform function applying the enforced case
 */
function getForcedCase(rule) {
	if (!rule) {
		return null;
	}

	const [, [severity, applicable, value]] = rule;
	const negated = applicable === 'never';

	if (severity === 0) {
		return null;
	}

	if (negated) {
		return value === 'lowerCase' ?
			'upperCase' :
			'lowerCase';
	}

	return value === 'lowerCase' ?
		'lowerCase' :
		'upperCase';
}

/**
 * Get forced case for rule
 * @param {object} rule to parse
 * @return {fn} transform function applying the enforced case
 */
function getForcedCaseFn(rule) {
	const noop = input => input;
	const lowerCase = input => String.prototype.toLowerCase.call(input);
	const upperCase = input => String.prototype.toUpperCase.call(input);

	if (!rule) {
		return noop;
	}

	// const case = getForcedCase(rule);
	const forcedCase = getForcedCase(rule);

	if (forcedCase === null) {
		return noop;
	}

	return forcedCase === 'lowerCase' ?
		lowerCase :
		upperCase;
}

/**
 * Get forced leading for rule
 * @param {object} rule to parse
 * @return {boolean|null} transform function applying the leading
 */
function getForcedLeading(rule) {
	if (!rule) {
		return null;
	}

	const [, [severity, applicable]] = rule;
	const negated = applicable === 'never';

	if (severity === 0) {
		return null;
	}

	return !negated;
}

/**
 * Get forced leading for rule
 * @param {object} rule to parse
 * @return {fn} transform function applying the leading
 */
function getForcedLeadingFn(rule) {
	const noop = input => input;
	const remove = input => {
		const fragments = input.split('\n');
		return fragments[0] === '' ?
			fragments.slice(1).join('\n') :
			input;
	};
	const lead = input => {
		const fragments = input.split('\n');
		return fragments[0] === '' ?
			input :
			['', ...fragments].join('\n');
	};

	if (!rule) {
		return noop;
	}

	const leading = getForcedLeading(rule);

	if (leading === null) {
		return noop;
	}

	return leading ?
		lead :
		remove;
}

/**
 * get a cli prompt based on rule configuration
 * @param  {string} type     type of the data to gather
 * @param  {array} rules     rules to parse
 * @param  {object} settings = {} additional display settings
 * @param  {object} results = {} results to display for live editing
 * @return {object}          prompt instance
 */
function getPrompt(type, rules, settings = {}, results = {}) {
	const prompt = vorpal();

	const enumRule = rules
		.filter(getHasName('enum'))
		.filter(enumRuleIsActive)[0];

	const emptyRule = rules
		.filter(getHasName('empty'))[0];

	const mustBeEmpty = emptyRule ?
		emptyRule[1][0] > 0 &&
		emptyRule[1][1] === 'always' :
		false;

	const mayNotBeEmpty = emptyRule ?
		emptyRule[1][0] > 0 &&
		emptyRule[1][1] === 'never' :
		false;

	const mayBeEmpty = !mayNotBeEmpty;

	if (mustBeEmpty) {
		prompt.removeAllListeners('keypress');
		prompt.removeAllListeners('client_prompt_submit');
		prompt.ui.redraw.done();
		return Promise.resolve();
	}

	const caseRule = rules
		.filter(getHasName('case'))[0];

	const forcedCase = getForcedCase(caseRule);
	const forceCaseFn = getForcedCaseFn(caseRule);

	const leadingBlankRule = rules
		.filter(getHasName('leading-blank'))[0];

	const forceLeadingBlankFn = getForcedLeadingFn(leadingBlankRule);

	const maxLenghtRule = rules
		.filter(getHasName('max-length'))[0];

	const hasMaxLength = maxLenghtRule && maxLenghtRule[1][0] > 0;

	const inputMaxLength = hasMaxLength ?
		maxLenghtRule[1][1] :
		Infinity;

	const headerLength = settings.header ?
		settings.header.length :
		Infinity;

	const remainingHeaderLength = headerLength ?
		headerLength - [
			results.type,
			results.scope,
			results.scope ? '()' : '',
			results.type && results.scope ? ':' : '',
			results.subject
		].join('').length :
		Infinity;

	const maxLength = Math.min(inputMaxLength, remainingHeaderLength);

	return new Promise(resolve => {
		// Add the defined enums as sub commands if applicable
		if (enumRule) {
			const [, [, , enums]] = enumRule;

			enums.forEach(enumerable => {
				const enumSettings = (settings.enumerables || {})[enumerable] || {};
				prompt
					.command(enumerable)
					.description(enumSettings.description || '')
					.action(() => {
						prompt.removeAllListeners();
						prompt.ui.redraw.done();
						return resolve(forceLeadingBlankFn(forceCaseFn(enumerable)));
					});
			});
		} else {
			prompt
				.catch('[text...]')
				.action(parameters => {
					const {text} = parameters;
					prompt.removeAllListeners();
					prompt.ui.redraw.done();
					return resolve(forceLeadingBlankFn(forceCaseFn(text.join(' '))));
				});
		}

		if (mayBeEmpty) {
			// Add an easy exit command
			prompt
				.command(':skip')
				.description('Skip the input if possible.')
				.action(() => {
					prompt.removeAllListeners();
					prompt.ui.redraw.done();
					resolve('');
				});
		}

		// Handle empty input
		const onSubmit = input => {
			if (input.length > 0) {
				return;
			}

			// Show help if enum is defined and input may not be empty
			if (mayNotBeEmpty) {
				prompt.ui.log(chalk.yellow(`⚠ ${chalk.bold(type)} may not be empty.`));
			}

			if (mayBeEmpty) {
				prompt.ui.log(chalk.blue(`ℹ Enter ${chalk.bold(':skip')} to omit ${chalk.bold(type)}.`));
			}

			if (enumRule) {
				prompt.exec('help');
			}
		};

		const drawRemaining = length => {
			if (length < Infinity) {
				const colors = [
					{
						threshold: 5,
						color: 'red'
					},
					{
						threshold: 10,
						color: 'yellow'
					},
					{
						threshold: Infinity,
						color: 'grey'
					}
				];

				const color = colors
					.filter(item => {
						return item.threshold >= length;
					})
					.map(item => item.color)[0];

				prompt.ui.redraw(chalk[color](`${length} characters left`));
			}
		};

		const onKey = event => {
			const sanitized = forceCaseFn(event.value);
			const cropped = sanitized.slice(0, maxLength);

			// We **could** do live editing, but there are some quirks to solve
			/* const live = merge({}, results, {
				[type]: cropped
			});
			prompt.ui.redraw(`\n\n${format(live, true)}\n\n`); */

			if (maxLength) {
				drawRemaining(maxLength - cropped.length);
			}
			prompt.ui.input(cropped);
		};

		prompt.addListener('keypress', onKey);
		prompt.addListener('client_prompt_submit', onSubmit);

		prompt.log(`\n\nPlease enter a ${chalk.bold(type)}: ${meta({
			'optional': !mayNotBeEmpty,
			'required': mayNotBeEmpty,
			'tab-completion': typeof enumRule !== 'undefined',
			'header': typeof settings.header !== 'undefined',
			'case': forcedCase,
			'multi-line': settings.multiline
		})}`);

		if (settings.description) {
			prompt.log(chalk.grey(`${settings.description}\n`));
		}

		prompt.log(`\n\n${format(results, true)}\n\n`);

		drawRemaining(maxLength);

		prompt
			.delimiter(`❯ ${type}:`)
			.show();
	});
}

const settings = {
	type: {
		description: '<type> holds information about the goal of a change.',
		enumerables: {
			feat: {
				description: 'Adds a new feature.'
			},
			fix: {
				description: 'Solves a bug.'
			},
			docs: {
				description: 'Adds or alters documentation.'
			},
			style: {
				description: 'Improves formatting, white-space.'
			},
			refactor: {
				description: 'Rewrites code without feature, performance or bug changes.'
			},
			perf: {
				description: 'Improves performance.'
			},
			test: {
				description: 'Adds or modifies tests.'
			},
			chore: {
				description: 'Change build process, tooling or dependencies.'
			}
		}
	},
	scope: {
		description: '<scope> marks which sub-component of the project is affected'
	},
	subject: {
		description: '<subject> is a short, high-level description of the change'
	},
	body: {
		description: '<body> holds additional information about the change',
		multline: true
	},
	footer: {
		description: '<footer> holds further meta data, such as breaking changes and issue ids',
		multiline: true
	}
};

/**
 * Get formatted commit message
 * @param  {object}  input object containing structured results
 * @param  {boolean} debug show debug information in commit message
 * @return {string}        formatted debug message
 */
function format(input, debug = false) {
	// show debug format data if debug = true
	const results = debug ?
		Object.entries(input)
			.reduce((registry, item) => {
				const [name, value] = item;
				return {
					...registry,
					[name]: value === null ?
						chalk.grey(`<${name}>`) :
						chalk.bold(value)
				};
			}, {}) :
		input;

	// Return formatted string
	const {type, scope, subject, body, footer} = results;
	return [
		`${type}${scope ? '(' : ''}${scope}${scope ? ')' : ''}${type || scope ? ':' : ''} ${subject}`,
		body,
		footer
	].filter(Boolean).join('\n');
}

/* eslint-disable valid-jsdoc */
/**
 * Get user input by interactive prompt based on
 * conventional-changelog-lint rules.
 * @return {Promise<string>} commit message
 */
export default async () => {
	const results = {
		type: null,
		scope: null,
		subject: null,
		body: null,
		footer: null
	};

	// Get the current conventional-changelog-lint configuration
	const configuration = await getConfiguration('conventional-changelog-lint');
	const preset = await getPreset(configuration.preset || 'angular');
	const {rules} = merge({}, configuration, preset);

	for (const input of ['type', 'scope', 'subject', 'body', 'footer']) {
		const inputRules = getRules(input, rules);
		const inputSettings = settings[input];

		const isHeader = ['type', 'scope', 'subject'].indexOf(input) > -1;

		const headerLengthRule = getRules('header', rules)
			.filter(getHasName('max-length'))[0];

		if (isHeader && headerLengthRule) {
			const [, [severity, applicable, length]] = headerLengthRule;
			if (severity > 0 && applicable === 'always') {
				inputSettings.header = {
					length
				};
			}
		}

		results[input] = await getPrompt(input, inputRules, inputSettings, results);
	}

	// Return the results
	return format(results);
};
