import chalk from 'chalk';

import type {InputSetting, Prompter, Result, RuleEntry} from './types';

import enumRuleIsActive from './enum-rule-is-active';
import format from './format';
import getForcedCaseFn from './get-forced-case-fn';
import getForcedLeadingFn from './get-forced-leading-fn';
import getHasName from './get-has-name';
import meta from './meta';

export default getPrompt;

/**
 * Get a cli prompt based on rule configuration
 * @param type type of the data to gather
 * @param context rules to parse
 * @return prompt instance
 */
function getPrompt(
	type: string,
	context: {
		rules?: RuleEntry[];
		settings?: InputSetting;
		results?: Result;
		prompter?: () => Prompter;
	} = {}
): Promise<string | undefined> {
	const {rules = [], settings = {}, results = {}, prompter} = context;

	if (typeof prompter !== 'function') {
		throw new TypeError('Missing prompter function in getPrompt context');
	}

	const prompt = prompter();

	if (typeof prompt.removeAllListeners !== 'function') {
		throw new TypeError(
			'getPrompt: prompt.removeAllListeners is not a function'
		);
	}

	if (typeof prompt.command !== 'function') {
		throw new TypeError('getPrompt: prompt.command is not a function');
	}

	if (typeof prompt.catch !== 'function') {
		throw new TypeError('getPrompt: prompt.catch is not a function');
	}

	if (typeof prompt.addListener !== 'function') {
		throw new TypeError('getPrompt: prompt.addListener is not a function');
	}

	if (typeof prompt.log !== 'function') {
		throw new TypeError('getPrompt: prompt.log is not a function');
	}

	if (typeof prompt.delimiter !== 'function') {
		throw new TypeError('getPrompt: prompt.delimiter is not a function');
	}

	if (typeof prompt.show !== 'function') {
		throw new TypeError('getPrompt: prompt.show is not a function');
	}

	const enumRule = rules.filter(getHasName('enum')).find(enumRuleIsActive);

	const emptyRule = rules.find(getHasName('empty'));

	const mustBeEmpty = emptyRule
		? emptyRule[1][0] > 0 && emptyRule[1][1] === 'always'
		: false;

	const mayNotBeEmpty = emptyRule
		? emptyRule[1][0] > 0 && emptyRule[1][1] === 'never'
		: false;

	const mayBeEmpty = !mayNotBeEmpty;

	if (mustBeEmpty) {
		prompt.removeAllListeners('keypress');
		prompt.removeAllListeners('client_prompt_submit');
		prompt.ui.redraw.done();
		return Promise.resolve(undefined);
	}

	const caseRule = rules.find(getHasName('case'));

	const forceCaseFn = getForcedCaseFn(caseRule);

	const leadingBlankRule = rules.find(getHasName('leading-blank'));

	const forceLeadingBlankFn = getForcedLeadingFn(leadingBlankRule);

	const maxLengthRule = rules.find(getHasName('max-length'));

	const inputMaxLength =
		maxLengthRule &&
		maxLengthRule[1] &&
		maxLengthRule[1][0] > 0 &&
		typeof maxLengthRule[1][1] === 'number'
			? maxLengthRule[1][1]
			: Infinity;

	const headerLength = settings.header ? settings.header.length : Infinity;

	const remainingHeaderLength = headerLength
		? headerLength -
		  [
				results.type,
				results.scope,
				results.scope ? '()' : '',
				results.type && results.scope ? ':' : '',
				results.subject,
		  ].join('').length
		: Infinity;

	const maxLength = Math.min(inputMaxLength, remainingHeaderLength);

	return new Promise((resolve) => {
		// Add the defined enums as sub commands if applicable
		if (enumRule) {
			const [, [, , enums]] = enumRule;

			enums.forEach((enumerable) => {
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
			prompt.catch('[text...]').action((parameters) => {
				const {text = ''} = parameters;
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
		const onSubmit = (input: string) => {
			if (input.length > 0) {
				return;
			}

			// Show help if enum is defined and input may not be empty
			if (mayNotBeEmpty) {
				prompt.ui.log(chalk.yellow(`⚠ ${chalk.bold(type)} may not be empty.`));
			}

			if (mayBeEmpty) {
				prompt.ui.log(
					chalk.blue(
						`ℹ Enter ${chalk.bold(':skip')} to omit ${chalk.bold(type)}.`
					)
				);
			}

			if (enumRule) {
				prompt.exec('help');
			}
		};

		const drawRemaining = (length: number) => {
			if (length < Infinity) {
				const colors = [
					{
						threshold: 5,
						color: chalk.red,
					},
					{
						threshold: 10,
						color: chalk.yellow,
					},
					{
						threshold: Infinity,
						color: chalk.grey,
					},
				];

				const el = colors.find((item) => item.threshold >= length);
				const color = el ? el.color : chalk.grey;
				prompt.ui.redraw(color(`${length} characters left`));
			}
		};

		const onKey = (event: {value: string}) => {
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

		prompt.log(
			`\n\nPlease enter a ${chalk.bold(type)}: ${meta({
				optional: !mayNotBeEmpty,
				required: mayNotBeEmpty,
				'tab-completion': typeof enumRule !== 'undefined',
				header: typeof settings.header !== 'undefined',
				'multi-line': settings.multiline,
			})}`
		);

		if (settings.description) {
			prompt.log(chalk.grey(`${settings.description}\n`));
		}

		prompt.log(`\n\n${format(results, true)}\n\n`);

		drawRemaining(maxLength);

		prompt.delimiter(`❯ ${type}:`).show();
	});
}
