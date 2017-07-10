import 'babel-polyfill';  // eslint-disable-line import/no-unassigned-import
import vorpal from 'vorpal';
import input from './input';

/**
 * Entry point for commitizen
 * @param {object} _ inquirer instance passed by commitizen, unused
 * @param {function} commit callback to execute with complete commit message
 * @return {string} genersated commit message
 */
export const prompter = async (_, commit) => { // eslint-disable-line import/prefer-default-export
	const message = await input(vorpal);
	commit(message);
};
