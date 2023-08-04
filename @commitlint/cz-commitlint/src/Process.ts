import {QualifiedRules, UserPromptConfig} from '@commitlint/types';
import {Inquirer} from 'inquirer';
import {
	combineCommitMessage as combineBody,
	getQuestions as getBodyQuestions,
} from './SectionBody';
import {
	combineCommitMessage as combineFooter,
	getQuestions as getFooterQuestions,
} from './SectionFooter';
import {
	combineCommitMessage as combineHeader,
	getQuestions as getHeaderQuestions,
} from './SectionHeader';
import {setPromptConfig} from './store/prompts';
import {setRules} from './store/rules';

export default async function (
	rules: QualifiedRules,
	prompts: UserPromptConfig,
	inquirer: Inquirer,
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
