/* eslint-disable import/no-unassigned-import, import/prefer-default-export */
import vorpal from 'vorpal';
import input from './input';

/**
 * Entry point for commitizen
 * @param {object} _ inquirer instance passed by commitizen, unused
 * @param {function} commit callback to execute with complete commit message
 * @return {string} genersated commit message
 */
export const prompter = async (_, commit) => {
	const message = await input(vorpal);
	commit(message);
};
