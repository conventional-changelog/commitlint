import {QualifiedRules} from '@commitlint/types';
import {Answers, DistinctQuestion, Inquirer} from 'inquirer';
import wrap from 'word-wrap';
import Question, {QuestionConfig} from './Question';
import {PromptConfig, PromptName, Rule, RuleField} from './types';
import getCaseFn from './utils/case-fn';
import getFullStopFn from './utils/full-stop-fn';
import getLeadingBlankFn from './utils/leading-blank-fn';
import {
	enumRuleIsActive,
	getEnumList,
	getMaxLength,
	getMinLength,
	ruleIsActive,
	ruleIsApplicable,
	ruleIsNotApplicable,
} from './utils/rules';

export default class Prompter {
	rules: QualifiedRules;
	prompts: PromptConfig;

	constructor(rules: QualifiedRules, prompts: PromptConfig) {
		this.rules = rules;
		this.prompts = prompts;
	}

	async prompt(inquirer: Inquirer): Promise<string> {
		inquirer.registerPrompt(
			'autocomplete',
			require('inquirer-autocomplete-prompt')
		);

		const questions = [
			...this.getHeaderQuestions(),
			...this.getBodyQuestions(),
			...this.getFooterQuestions(),
		];
		const answers = await inquirer.prompt(questions);

		return this.handleAnswers(answers);
	}

	getHeaderQuestions(): Array<DistinctQuestion> {
		// header: type, scope, subject
		const headerMaxLength = getMaxLength(this.getRule('header', 'max-length'));
		const headerMinLength = getMinLength(this.getRule('header', 'min-length'));
		const questions: Array<DistinctQuestion> = [];

		const headerRuleFields: RuleField[] = ['type', 'scope', 'subject'];

		headerRuleFields.forEach((name) => {
			const questionConfig = this.getRuleQuestionConfig(name);
			if (questionConfig) {
				const instance = new Question(<PromptName>name, questionConfig);
				const combineHeader = this.combineHeader.bind(this);
				instance.onBeforeAsk = function (answers) {
					const headerRemainLength =
						headerMaxLength - combineHeader(answers).length;
					this.maxLength = Math.min(this.maxLength, headerRemainLength);
					this.minLength = Math.max(this.minLength, headerMinLength);
				};
				questions.push(instance.getQuestion());
			}
		});
		return questions;
	}

	getBodyQuestions(): Array<DistinctQuestion> {
		// body
		const questionConfig = this.getRuleQuestionConfig('body');

		if (!questionConfig) return [];
		else return [new Question('body', questionConfig).getQuestion()];
	}

	getFooterQuestions(): Array<DistinctQuestion> {
		const footerQuestionConfig = this.getRuleQuestionConfig('footer');

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
			.filter((name) => name in this.prompts.questions)
			.map((name) => {
				const {questions, messages} = this.prompts;

				const questionConfigs = {
					messages: {
						title: questions[name]?.description ?? '',
						...messages,
					},
					maxLength: footerMaxLength,
					minLength: footerMinLength,
				};

				if (name === 'isBreaking') {
					Object.assign(questionConfigs, {
						defaultValue: false,
					});
				}

				if (name === 'breaking') {
					Object.assign(questionConfigs, {
						when: (answers: Answers) => {
							return answers.isBreaking;
						},
					});
				}

				if (name === 'breakingBody') {
					Object.assign(questionConfigs, {
						when: (answers: Answers) => {
							return answers.isBreaking && !answers.body;
						},
					});
				}

				if (name === 'isIssueAffected') {
					Object.assign(questionConfigs, {
						default: false,
					});
				}

				if (name === 'issues') {
					Object.assign(questionConfigs, {
						when: (answers: Answers) => {
							return answers.isIssueAffected;
						},
					});
				}

				if (name === 'issuesBody') {
					Object.assign(questionConfigs, {
						when: (answers: Answers) => {
							return (
								answers.isIssueAffected &&
								!answers.body &&
								!answers.breakingBody
							);
						},
					});
				}
				const instance = new Question(name, questionConfigs);
				const combineFooter = this.combineFooter.bind(this);
				instance.onBeforeAsk = function (answers) {
					const remainLength = footerMaxLength - combineFooter(answers).length;
					this.maxLength = Math.min(this.maxLength, remainLength);
					this.minLength = Math.max(this.minLength, footerMinLength);
				};

				return instance.getQuestion();
			});
	}

	getRuleQuestionConfig(rulePrefix: RuleField): QuestionConfig | null {
		const {messages, questions} = this.prompts;
		const questionSettings = questions[rulePrefix];
		const emptyRule = this.getRule(rulePrefix, 'empty');
		const mustBeEmpty =
			emptyRule && ruleIsActive(emptyRule) && ruleIsApplicable(emptyRule);

		if (mustBeEmpty) {
			return null;
		}

		const canBeSkip = !(
			emptyRule &&
			ruleIsActive(emptyRule) &&
			ruleIsNotApplicable(emptyRule)
		);

		const enumRule = this.getRule(rulePrefix, 'enum');
		const enumRuleList =
			enumRule && enumRuleIsActive(enumRule) ? getEnumList(enumRule) : null;
		let enumList;

		if (enumRuleList) {
			const enumDescriptions = questionSettings?.['enum'];

			if (enumDescriptions) {
				const enumNames = Object.keys(enumDescriptions);
				const longest = Math.max(
					...enumRuleList.map((enumName) => enumName.length)
				);
				// TODO emoji + title
				enumList = enumRuleList
					.sort((a, b) => enumNames.indexOf(a) - enumNames.indexOf(b))
					.map((enumName) => {
						const enumDescription = enumDescriptions[enumName];
						if (enumDescription) {
							return {
								name:
									`${enumName}:`.padEnd(longest + 4) +
									enumDescription['description'],
								value: enumName,
								short: enumName,
							};
						} else {
							return enumName;
						}
					});
			} else {
				enumList = enumRuleList;
			}
		}

		return {
			skip: canBeSkip,
			enumList,
			caseFn: getCaseFn(this.getRule(rulePrefix, 'case')),
			fullStopFn: getFullStopFn(this.getRule(rulePrefix, 'full-stop')),
			minLength: getMinLength(this.getRule(rulePrefix, 'min-length')),
			maxLength: getMaxLength(this.getRule(rulePrefix, 'max-length')),
			messages: {
				title: questionSettings?.['description'] ?? '',
				...messages,
			},
		};
	}

	getRule(key: string, property: string): Rule | undefined {
		return this.rules[`${key}-${property}`];
	}

	handleAnswers(answers: Answers): string {
		const header = this.combineHeader(answers);
		const body = this.combineBody(answers);
		const footer = this.combineFooter(answers);

		return [header, body, footer].filter(Boolean).join('\n');
	}

	combineHeader(answers: Answers): string {
		const {type = '', scope = '', subject = ''} = answers;
		const prefix = `${type}${scope ? `(${scope})` : ''}`;

		return (prefix ? prefix + ': ' : '') + subject;
	}

	combineBody(answers: Answers): string {
		const maxLineLength = getMaxLength(this.getRule('body', 'max-line-length'));
		const leadingBlankFn = getLeadingBlankFn(
			this.getRule('body', 'leading-blank')
		);
		const {body, breakingBody, issuesBody} = answers;

		const commitBody = body ?? breakingBody ?? issuesBody ?? '-';

		if (commitBody) {
			return leadingBlankFn(
				wrap(commitBody, {
					width: maxLineLength,
					trim: true,
				})
			);
		} else {
			return '';
		}
	}

	combineFooter(answers: Answers): string {
		// TODO references-empty
		// TODO signed-off-by
		const maxLineLength = getMaxLength(
			this.getRule('footer', 'max-line-length')
		);
		const leadingBlankFn = getLeadingBlankFn(
			this.getRule('footer', 'leading-blank')
		);

		const {footer, breaking, issues} = answers;
		const footerNotes: string[] = [];

		if (breaking) {
			const BREAKING_CHANGE = 'BREAKING CHANGE: ';
			footerNotes.push(
				wrap(
					BREAKING_CHANGE +
						breaking.replace(new RegExp(`^${BREAKING_CHANGE}`), ''),
					{
						width: maxLineLength,
						trim: true,
					}
				)
			);
		}

		if (issues) {
			footerNotes.push(
				wrap(issues, {
					width: maxLineLength,
					trim: true,
				})
			);
		}

		if (footer) {
			footerNotes.push(
				wrap(footer, {
					width: maxLineLength,
					trim: true,
				})
			);
		}

		return leadingBlankFn(footerNotes.join('\n'));
	}
}
