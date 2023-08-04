import chalk from 'chalk';
import type {InputCustomOptions} from 'inquirer';

import type {InputSetting, RuleEntry, Result, ResultPart} from './types';

import format from './format';
import getForcedCaseFn from './get-forced-case-fn';
import getForcedLeadingFn from './get-forced-leading-fn';
import meta from './meta';
import {
	enumRuleIsActive,
	getHasName,
	getMaxLength,
	ruleIsActive,
	ruleIsApplicable,
	ruleIsNotApplicable,
} from './utils';

const EOL = '\n';

/**
 * Get a cli prompt based on rule configuration
 * @param type type of the data to gather
 * @param rules
 * @param settings
 * @return prompt instance
 */
export default function getPrompt(
	type: ResultPart,
	rules: RuleEntry[] = [],
	settings: InputSetting = {},
): InputCustomOptions<Result> | null {
	const emptyRule = rules.filter(getHasName('empty')).find(ruleIsActive);

	const mustBeEmpty = emptyRule ? ruleIsApplicable(emptyRule) : false;

	if (mustBeEmpty) {
		return null;
	}

	const required = emptyRule ? ruleIsNotApplicable(emptyRule) : false;

	const forceCaseFn = getForcedCaseFn(rules.find(getHasName('case')));
	const forceLeadingBlankFn = getForcedLeadingFn(
		rules.find(getHasName('leading-blank')),
	);

	const maxLengthRule = rules.find(getHasName('max-length'));
	const inputMaxLength = getMaxLength(maxLengthRule);

	const enumRule = rules.filter(getHasName('enum')).find(enumRuleIsActive);

	const tabCompletion = enumRule
		? enumRule[1][2].map((enumerable) => {
				const enumSettings = (settings.enumerables || {})[enumerable] || {};
				return {
					value: forceLeadingBlankFn(forceCaseFn(enumerable)),
					description: enumSettings.description || '',
				};
		  })
		: [];

	const maxLength = (res: Result) => {
		let remainingHeaderLength = Infinity;
		if (settings.header && settings.header.length) {
			const header = format({
				type: res.type,
				scope: res.scope,
				subject: res.subject,
			});
			remainingHeaderLength = settings.header.length - header.length;
		}
		return Math.min(inputMaxLength, remainingHeaderLength);
	};

	return {
		type: 'input-custom',
		name: type,
		message: `${type}:`,
		validate(input, answers) {
			if (input.length > maxLength(answers || {})) {
				return 'Input contains too many characters!';
			}
			if (required && input.trim().length === 0) {
				// Show help if enum is defined and input may not be empty
				return `⚠ ${chalk.bold(type)} may not be empty.`;
			}

			const tabValues = tabCompletion.map((item) => item.value);
			if (
				input.length > 0 &&
				tabValues.length > 0 &&
				!tabValues.includes(input)
			) {
				return `⚠ ${chalk.bold(type)} must be one of ${tabValues.join(', ')}.`;
			}
			return true;
		},
		tabCompletion,
		log(answers?: Result) {
			let prefix =
				`${chalk.white('Please enter a')} ${chalk.bold(type)}: ${meta({
					optional: !required,
					required: required,
					'tab-completion': typeof enumRule !== 'undefined',
					header: typeof settings.header !== 'undefined',
					'multi-line': settings.multiline,
				})}` + EOL;

			if (settings.description) {
				prefix += chalk.grey(`${settings.description}`) + EOL;
			}
			if (answers) {
				prefix += EOL + `${format(answers, true)}` + EOL;
			}
			return prefix + EOL;
		},
		maxLength,
		transformer(value: string) {
			return forceCaseFn(value);
		},
	};
}
