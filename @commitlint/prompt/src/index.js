import 'babel-polyfill';  // eslint-disable-line import/no-unassigned-import
import getInput from './get-input';

/**
 * Entry point for commitizen
 * @param {object} _ inquirer instance passed by commitizen, unused
 * @param {function} commit callback to execute with complete commit message
 * @return {string} genersated commit message
 */
export const prompter = async ({prompt}, commit) => { // eslint-disable-line import/prefer-default-export
	getInput(prompt)
		.then(result => commit(result))
		.catch(err => {
			setTimeout(() => {
				throw err;
			}, 0);
		});
};
