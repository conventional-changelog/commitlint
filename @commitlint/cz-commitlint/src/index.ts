import load from '@commitlint/load';
import type {Answers, DistinctQuestion} from 'inquirer';

import process from './Process.js';

type Commit = (message: string) => void;
/**
 * Entry point for commitizen
 * @param  inquirerIns instance passed by commitizen, unused
 * @param commit callback to execute with complete commit message
 * @return {void}
 */
export function prompter(
	inquirerIns: {
		prompt(questions: DistinctQuestion[]): Promise<Answers>;
	},
	commit: Commit
): void {
	load().then(({rules, prompt = {}}) => {
		process(rules, prompt, inquirerIns).then(commit);
	});
}
