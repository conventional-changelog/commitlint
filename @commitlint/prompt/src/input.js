import {load} from '@commitlint/core';
import throat from 'throat';

import format from './library/format';
import getHasName from './library/get-has-name';
import getPrompt from './library/get-prompt';
import settings from './settings';

export default input;

/* eslint-disable valid-jsdoc */
/**
 * Get user input by interactive prompt based on
 * conventional-changelog-lint rules.
 * @param {function} prompter
 * @return {Promise<string>} commit message
 */
async function input(prompter) {
	const results = {
		type: null,
		scope: null,
		subject: null,
		body: null,
		footer: null
	};

	const {rules} = await load();

	await Promise.all(
		['type', 'scope', 'subject', 'body', 'footer'].map(
			throat(1, async input => {
				const inputRules = getRules(input, rules);
				const inputSettings = settings[input];

				const isHeader = ['type', 'scope', 'subject'].indexOf(input) > -1;

				const headerLengthRule = getRules('header', rules).filter(
					getHasName('max-length')
				)[0];

				if (isHeader && headerLengthRule) {
					const [, [severity, applicable, length]] = headerLengthRule;
					if (severity > 0 && applicable === 'always') {
						inputSettings.header = {
							length
						};
					}
				}

				results[input] = await getPrompt(input, {
					// eslint-disable-line no-await-in-loop
					rules: inputRules,
					settings: inputSettings,
					results,
					prompter
				});
			})
		)
	).catch(err => {
		console.error(err);
		return '';
	});

	// Return the results
	return format(results);
}

/**
 * Get prefix for a given rule id
 * @param  {string} id of the rule
 * @return {string} prefix of the rule
 */
function getRulePrefix(id) {
	const fragments = id.split('-');
	const [prefix] = fragments;
	return fragments.length > 1 ? prefix : null;
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
 * Get rules for a given prefix
 * @param  {string} prefix to search in rule names
 * @param  {object} rules  rules to search in
 * @return {object}        rules matching the prefix search
 */
function getRules(prefix, rules) {
	return Object.entries(rules).filter(getHasPrefix(prefix));
}
