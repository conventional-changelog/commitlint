import inquirer from 'inquirer';
import input from './input';

type Commit = (input: string) => void;

/**
 * Entry point for commitizen
 * @param cz inquirer instance passed by commitizen
 * @param commit callback to execute with complete commit message
 * @return generated commit message
 */
export async function prompter(
	cz: typeof inquirer,
	commit: Commit
): Promise<void> {
	const message = await input(cz.prompt);
	commit(message);
}
