import load from '@commitlint/load';
import {DistinctQuestion, PromptModule} from 'inquirer';

import format from './library/format';
import getPrompt from './library/get-prompt';
import settings from './settings';
import {InputSetting, Result} from './library/types';

import {getHasName, getMaxLength, getRules} from './library/utils';
import InputCustomPrompt from './inquirer/InputCustomPrompt';

/**
 * Get user input by interactive prompt based on
 * conventional-changelog-lint rules.
 * @param prompter
 * @return commit message
 */
export default async function input(prompter: PromptModule): Promise<string> {
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
			const inputSettings: InputSetting = settings[input];
			const inputRules = getRules(input, rules);
			if (headerParts.includes(input) && maxLength < Infinity) {
				inputSettings.header = {
					length: maxLength,
				};
			}
			const question = getPrompt(input, inputRules, inputSettings);
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
