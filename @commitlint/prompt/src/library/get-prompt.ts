import chalk from 'chalk';

import {InputCustomOptions, InputQuestion, ListQuestion} from 'inquirer';

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
	settings: InputSetting = {}
):
	| InputQuestion<Result>
	| ListQuestion<Result>
	| InputCustomOptions<Result>
	| null {
	const emptyRule = rules.filter(getHasName('empty')).find(ruleIsActive);

	const mustBeEmpty = emptyRule ? ruleIsApplicable(emptyRule) : false;

	if (mustBeEmpty) {
		return null;
	}

	const required = emptyRule ? ruleIsNotApplicable(emptyRule) : false;

	const forceCaseFn = getForcedCaseFn(rules.find(getHasName('case')));
	const forceLeadingBlankFn = getForcedLeadingFn(
		rules.find(getHasName('leading-blank'))
	);

	const maxLengthRule = rules.find(getHasName('max-length'));
	const inputMaxLength = getMaxLength(maxLengthRule);

	const enumRule = rules.filter(getHasName('enum')).find(enumRuleIsActive);

	return {
		type: 'input-custom',
		name: type,
		message: `${type}:`,
		validate(): boolean | string {
			return true;
		},
		tabCompletion: enumRule
			? enumRule[1][2].map((enumerable) => {
					const value = forceLeadingBlankFn(forceCaseFn(enumerable));
					const enumSettings = (settings.enumerables || {})[enumerable] || {};
					return {
						value: value,
						description: enumSettings.description || '',
					};
			  })
			: [],
		required,
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
		maxLength(res: Result) {
			const headerLength = settings.header ? settings.header.length : Infinity;
			const header = `${res.type}${res.scope ? `(${res.scope})` : ''}${
				res.type || res.scope ? ': ' : ''
			}${res.subject}`;
			const remainingHeaderLength = headerLength
				? headerLength - header.length
				: Infinity;
			return Math.min(inputMaxLength, remainingHeaderLength);
		},
		transformer(value: string) {
			return forceCaseFn(value);
		},
	};
}
