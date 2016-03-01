import 'babel-polyfill';
import getInput from './get-input';

/**
 * cz-conventional-changelog-lint entry point for conventional-changelog
 * @param {object} _ inquirer instance passed by commitizen, unused
 * @param {function} commit callback to execute with complete commit message
 * @return {string} generated commit message
 */
export const prompter = async ({prompt}, commit) => {
	getInput(prompt)
		.then(result => commit(result))
		.catch(error => {
			setTimeout(() => {
				throw error;
			}, 0);
		});
};
