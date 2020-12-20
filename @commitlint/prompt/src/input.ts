import load from '@commitlint/load';
import throat from 'throat';

import format from './library/format';
import getPrompt from './library/get-prompt';
import settings from './settings';
import {InputSetting, Prompter, Result} from './library/types';
import {getHasName, getMaxLength, getRules} from './library/utils';

export default input;

/**
 * Get user input by interactive prompt based on
 * conventional-changelog-lint rules.
 * @param prompter
 * @return commit message
 */
async function input(prompter: () => Prompter): Promise<string> {
	const results: Result = {
		type: null,
		scope: null,
		subject: null,
		body: null,
		footer: null,
	};

	const {rules} = await load();
	const parts = ['type', 'scope', 'subject', 'body', 'footer'] as const;
	const headerParts = ['type', 'scope', 'subject'];

	const headerLengthRule = getRules('header', rules).find(
		getHasName('max-length')
	);
	const maxLength = getMaxLength(headerLengthRule);

	await Promise.all(
		parts.map(
			throat(1, async (input) => {
				const inputRules = getRules(input, rules);
				const inputSettings: InputSetting = settings[input];

				if (headerParts.includes(input) && maxLength < Infinity) {
					inputSettings.header = {
						length: maxLength,
					};
				}

				results[input] = await getPrompt(input, {
					rules: inputRules,
					settings: inputSettings,
					results,
					prompter,
				});
			})
		)
	).catch((err) => {
		console.error(err);
		return '';
	});

	// Return the results
	return format(results);
}
