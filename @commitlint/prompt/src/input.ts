import load from '@commitlint/load';
import type {DistinctQuestion, PromptModule} from 'inquirer';

import format from './library/format.js';
import getPrompt from './library/get-prompt.js';
import settings from './settings.js';
import type {InputSetting, Result} from './library/types.js';
import {getHasName, getMaxLength, getRules} from './library/utils.js';
import InputCustomPrompt from './inquirer/InputCustomPrompt.js';

/**
 * Get user input by interactive prompt based on
 * conventional-changelog-lint rules.
 * @param prompter
 * @return commit message
 */
export async function input(prompter: PromptModule): Promise<string> {
	const {rules} = await load();
	const parts = ['type', 'scope', 'subject', 'body', 'footer'] as const;
	const headerParts = ['type', 'scope', 'subject'];

	const headerLengthRule = getRules('header', rules).find(
		getHasName('max-length')
	);
	const maxLength = getMaxLength(headerLengthRule);

	try {
		const questions: DistinctQuestion<Result>[] = [];
		prompter.registerPrompt('input-custom', InputCustomPrompt);

		for (const input of parts) {
			const inputSetting: InputSetting = settings[input];
			const inputRules = getRules(input, rules);
			if (headerParts.includes(input) && maxLength < Infinity) {
				inputSetting.header = {
					length: maxLength,
				};
			}
			const question = getPrompt(input, inputRules, inputSetting);
			if (question) {
				questions.push(question);
			}
		}

		const results = await prompter<Result>(questions);
		return format(results);
	} catch (err) {
		console.error(err);
		return '';
	}
}
