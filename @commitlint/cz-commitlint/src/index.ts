import load from '@commitlint/load';
import {Inquirer} from 'inquirer';
import {prompt} from './defaultSettings';
import Prompter from './Prompter';

type Commit = (message: string) => void;
/**
 * Entry point for commitizen
 * @param  inquirer instance passed by commitizen, unused
 * @param commit callback to execute with complete commit message
 * @return {void}
 */
export function prompter(inquirer: Inquirer, commit: Commit): void {
	load().then(({rules}) => {
		new Prompter(rules, prompt).prompt(inquirer).then(commit);
	});
}
