import {PromptName} from '@commitlint/types';
import {Answers, DistinctQuestion} from 'inquirer';
import wrap from 'word-wrap';
import Question, {QuestionConfig} from './Question';
import getRuleQuestionConfig from './services/getRuleQuestionConfig';
import {getPromptMessages, getPromptQuestions} from './store/prompts';
import {getRule} from './store/rules';
import getLeadingBlankFn from './utils/leading-blank-fn';
import {getMaxLength} from './utils/rules';

export class FooterQuestion extends Question {
	footerMaxLength: number;
	footerMinLength: number;
	constructor(
		name: PromptName,
		questionConfig: QuestionConfig,
		footerMaxLength?: number,
		footerMinLength?: number
	) {
		super(name, questionConfig);
		this.footerMaxLength = footerMaxLength ?? Infinity;
		this.footerMinLength = footerMinLength ?? 0;
	}
	beforeQuestionStart(answers: Answers): void {
		const footerRemainLength =
			this.footerMaxLength - combineCommitMessage(answers).length - '\n'.length;
		this.maxLength = Math.min(this.maxLength, footerRemainLength);
		this.minLength = Math.min(this.minLength, this.footerMinLength);
	}
}

export function getQuestions(): Array<DistinctQuestion> {
	const footerQuestionConfig = getRuleQuestionConfig('footer');

	if (!footerQuestionConfig) return [];

	const footerMaxLength = footerQuestionConfig.maxLength;
	const footerMinLength = footerQuestionConfig.minLength;

	const fields: PromptName[] = [
		'isBreaking',
		'breakingBody',
		'breaking',
		'isIssueAffected',
		'issuesBody',
		'issues',
		'footer',
	];

	return fields
		.filter((name) => name in getPromptQuestions())
		.map((name) => {
			const questions = getPromptQuestions();

			const questionConfigs = {
				title: questions[name]?.description ?? '',
				messages: getPromptMessages(),
				footerMaxLength,
				footerMinLength,
			};

			if (name === 'isBreaking') {
				Object.assign(questionConfigs, {
					defaultValue: false,
				});
			}

			if (name === 'breakingBody') {
				Object.assign(questionConfigs, {
					when: (answers: Answers) => {
						return answers.isBreaking && !answers.body;
					},
				});
			}

			if (name === 'breaking') {
				Object.assign(questionConfigs, {
					when: (answers: Answers) => {
						return answers.isBreaking;
					},
				});
			}

			if (name === 'isIssueAffected') {
				Object.assign(questionConfigs, {
					defaultValue: false,
				});
			}

			if (name === 'issuesBody') {
				Object.assign(questionConfigs, {
					when: (answers: Answers) => {
						return (
							answers.isIssueAffected && !answers.body && !answers.breakingBody
						);
					},
				});
			}

			if (name === 'issues') {
				Object.assign(questionConfigs, {
					when: (answers: Answers) => {
						return answers.isIssueAffected;
					},
				});
			}

			if (name === 'footer') {
				Object.assign(questionConfigs, {
					...footerQuestionConfig,
				});
			}

			const instance = new FooterQuestion(
				name,
				questionConfigs,
				footerMaxLength,
				footerMinLength
			);

			return instance.question;
		});
}

export function combineCommitMessage(answers: Answers): string {
	// TODO references-empty
	// TODO signed-off-by
	const maxLineLength = getMaxLength(getRule('footer', 'max-line-length'));
	const leadingBlankFn = getLeadingBlankFn(getRule('footer', 'leading-blank'));

	const {footer, breaking, issues} = answers;
	const footerNotes: string[] = [];

	if (breaking) {
		const BREAKING_CHANGE = 'BREAKING CHANGE: ';
		const message =
			BREAKING_CHANGE + breaking.replace(new RegExp(`^${BREAKING_CHANGE}`), '');
		footerNotes.push(
			maxLineLength < Infinity
				? wrap(message, {
						width: maxLineLength,
						trim: true,
						indent: '',
				  })
				: message.trim()
		);
	}

	if (issues) {
		footerNotes.push(
			maxLineLength < Infinity
				? wrap(issues, {
						width: maxLineLength,
						trim: true,
						indent: '',
				  })
				: issues.trim()
		);
	}

	if (footer) {
		footerNotes.push(
			maxLineLength < Infinity
				? wrap(footer, {
						width: maxLineLength,
						trim: true,
						indent: '',
				  })
				: footer
		);
	}

	return leadingBlankFn(footerNotes.join('\n'));
}
