import {QualifiedRules, UserPromptConfig} from '@commitlint/types';
import type {Answers, DistinctQuestion} from 'inquirer';

import {
	combineCommitMessage as combineBody,
	getQuestions as getBodyQuestions,
} from './SectionBody.js';
import {
	combineCommitMessage as combineFooter,
	getQuestions as getFooterQuestions,
} from './SectionFooter.js';
import {
	combineCommitMessage as combineHeader,
	getQuestions as getHeaderQuestions,
} from './SectionHeader.js';
import {setPromptConfig} from './store/prompts.js';
import {setRules} from './store/rules.js';

export default async function (
	rules: QualifiedRules,
	prompts: UserPromptConfig,
	inquirer: {
		prompt(questions: DistinctQuestion[]): Promise<Answers>;
	}
): Promise<string> {
	setRules(rules);
	setPromptConfig(prompts);
	const questions = [
		...getHeaderQuestions(),
		...getBodyQuestions(),
		...getFooterQuestions(),
	];
	const answers = await inquirer.prompt(questions);
	const header = combineHeader(answers);
	const body = combineBody(answers);
	const footer = combineFooter(answers);

	return [header, body, footer].filter(Boolean).join('\n');
}
