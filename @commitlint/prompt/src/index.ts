import inquirer from "inquirer";

import { input } from "./input.js";

type Commit = (input: string) => void;

/**
 * Entry point for commitizen
 * @param cz inquirer instance passed by commitizen, unused
 * @param commit callback to execute with complete commit message
 * @return {void}
 */
export function prompter(cz: typeof inquirer, commit: Commit): void {
	input(cz.prompt).then((message) => {
		commit(message);
	});
}
