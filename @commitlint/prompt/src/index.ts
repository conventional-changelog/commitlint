import inquirer from 'inquirer';
import {input} from './input';

type Commit = (input: string) => void;

export function prompter(cz: typeof inquirer, commit: Commit): void {
	input(cz.prompt).then((message) => {
		commit(message);
	});
}
