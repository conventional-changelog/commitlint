// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vorpal from 'vorpal';
import input from './input';

type Commit = (input: string) => void;

/**
 * Entry point for commitizen
 * @param {object} _ inquirer instance passed by commitizen, unused
 * @param {function} commit callback to execute with complete commit message
 * @return {string} genersated commit message
 */
export const prompter = async (_: unknown, commit: Commit): Promise<void> => {
	const message = await input(vorpal);
	commit(message);
};
