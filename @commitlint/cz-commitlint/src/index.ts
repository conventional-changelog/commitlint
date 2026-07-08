import load from "@commitlint/load";
import type { PromptAnswers, PromptQuestion } from "./types.js";

import process from "./Process.js";

type Commit = (message: string) => void;
/**
 * Entry point for commitizen
 * @param  inquirerIns instance passed by commitizen, unused
 * @param commit callback to execute with complete commit message
 * @return {void}
 */
export function prompter(
	inquirerIns: {
		prompt(questions: PromptQuestion[]): Promise<PromptAnswers>;
	},
	commit: Commit,
): void {
	load().then(({ rules, prompt = {} }) => {
		process(rules, prompt, inquirerIns).then(commit);
	});
}
