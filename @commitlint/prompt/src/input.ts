import load from '@commitlint/load';
import throat from 'throat';

import format from './library/format';
import getHasName from './library/get-has-name';
import getPrompt from './library/get-prompt';
import settings from './settings';
import {InputSetting, Prompter, Result, RuleEntry} from './library/types';
import {QualifiedRules} from '@commitlint/types';

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

	await Promise.all(
		(['type', 'scope', 'subject', 'body', 'footer'] as const).map(
			throat(1, async (input) => {
				const inputRules = getRules(input, rules);
				const inputSettings: InputSetting = settings[input];

				const isHeader = ['type', 'scope', 'subject'].indexOf(input) > -1;

				const headerLengthRule = getRules('header', rules).find(
					getHasName('max-length')
				);

				if (isHeader && headerLengthRule) {
					const [, [severity, applicable, length]] = headerLengthRule;
					if (
						severity > 0 &&
						applicable === 'always' &&
						typeof length === 'number'
					) {
						inputSettings.header = {
							length,
						};
					}
				}

				results[input] =
					(await getPrompt(input, {
						rules: inputRules,
						settings: inputSettings,
						results,
						prompter,
					})) || null;
			})
		)
	).catch((err) => {
		console.error(err);
		return '';
	});

	// Return the results
	return format(results);
}

/**
 * Get prefix for a given rule id
 * @param id of the rule
 * @return prefix of the rule
 */
function getRulePrefix(id: string) {
	const fragments = id.split('-');
	const [prefix] = fragments;
	return fragments.length > 1 ? prefix : null;
}

/**
 * Get rules for a given prefix
 * @param prefix to search in rule names
 * @param rules  rules to search in
 * @return rules matching the prefix search
 */
function getRules(prefix: string, rules: QualifiedRules) {
	return Object.entries(rules).filter(
		(rule): rule is RuleEntry => getRulePrefix(rule[0]) === prefix
	);
}
