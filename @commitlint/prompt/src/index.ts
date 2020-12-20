// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vorpal from 'vorpal';
import input from './input';

type Commit = (input: string) => void;

/**
 * Entry point for commitizen
 * @param _ inquirer instance passed by commitizen, unused
 * @param commit callback to execute with complete commit message
 * @return generated commit message
 */
export async function prompter(_: unknown, commit: Commit): Promise<void> {
	const message = await input(vorpal);
	commit(message);
}
