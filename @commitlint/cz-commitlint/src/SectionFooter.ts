import { PromptName } from "@commitlint/types";
import { Answers, DistinctQuestion } from "inquirer";
import wrap from "word-wrap";

import Question, { QuestionConfig } from "./Question.js";
import getRuleQuestionConfig from "./services/getRuleQuestionConfig.js";
import { getPromptMessages, getPromptQuestions } from "./store/prompts.js";
import { getRule } from "./store/rules.js";
import getLeadingBlankFn from "./utils/leading-blank-fn.js";
import { getMaxLength, ruleIsActive, ruleIsNotApplicable, ruleMustBeEmpty } from "./utils/rules.js";

export class FooterQuestion extends Question {
	footerMaxLength: number;
	footerMinLength: number;
	constructor(
		name: PromptName,
		questionConfig: QuestionConfig,
		footerMaxLength?: number,
		footerMinLength?: number,
	) {
		super(name, questionConfig);
		this.footerMaxLength = footerMaxLength ?? Infinity;
		this.footerMinLength = footerMinLength ?? 0;
	}
	beforeQuestionStart(answers: Answers): void {
		const footerRemainLength =
			this.footerMaxLength - combineCommitMessage(answers).length - "\n".length;
		this.maxLength = Math.min(this.maxLength, footerRemainLength);
		this.minLength = Math.min(this.minLength, this.footerMinLength);
	}
}

export function getQuestions(): Array<DistinctQuestion> {
	const footerQuestionConfig = getRuleQuestionConfig("footer");

	if (!footerQuestionConfig) return [];

	const footerMaxLength = footerQuestionConfig.maxLength;
	const footerMinLength = footerQuestionConfig.minLength;

	// references-empty decides whether issue references are asked for at all:
	// "always" forbids them. "never" makes them mandatory, and since the rule only
	// needs the reference itself, the other issue steps are left out then.
	const referencesRule = getRule("references", "empty");
	const referencesRequired =
		referencesRule !== undefined &&
		ruleIsActive(referencesRule) &&
		ruleIsNotApplicable(referencesRule);
	const referencesForbidden = ruleMustBeEmpty(referencesRule);

	// issuesBody would become the commit body, so it is left out when body-empty forbids one.
	const bodyForbidden = ruleMustBeEmpty(getRule("body", "empty"));

	const issueFields: PromptName[] = ["isIssueAffected", "issuesBody", "issues"];
	const fields: PromptName[] = ["isBreaking", "breakingBody", "breaking", ...issueFields, "footer"];

	return fields
		.filter((name) => name in getPromptQuestions())
		.filter((name) => !(referencesForbidden && issueFields.includes(name)))
		.filter((name) => !(referencesRequired && issueFields.includes(name) && name !== "issues"))
		.filter((name) => !(bodyForbidden && name === "issuesBody"))
		.map((name) => {
			const questions = getPromptQuestions();

			const questionConfigs = {
				title: questions[name]?.description ?? "",
				messages: getPromptMessages(),
				footerMaxLength,
				footerMinLength,
			};

			if (name === "isBreaking") {
				Object.assign(questionConfigs, {
					defaultValue: false,
				});
			}

			if (name === "breakingBody") {
				Object.assign(questionConfigs, {
					when: (answers: Answers) => {
						return answers.isBreaking && !answers.body;
					},
				});
			}

			if (name === "breaking") {
				Object.assign(questionConfigs, {
					when: (answers: Answers) => {
						return answers.isBreaking;
					},
				});
			}

			if (name === "isIssueAffected") {
				Object.assign(questionConfigs, {
					defaultValue: false,
				});
			}

			if (name === "issuesBody") {
				Object.assign(questionConfigs, {
					when: (answers: Answers) => {
						return answers.isIssueAffected && !answers.body && !answers.breakingBody;
					},
				});
			}

			if (name === "issues") {
				Object.assign(questionConfigs, {
					when: (answers: Answers) => {
						return referencesRequired || answers.isIssueAffected;
					},
				});
			}

			if (name === "footer") {
				Object.assign(questionConfigs, {
					...footerQuestionConfig,
				});
			}

			const instance = new FooterQuestion(name, questionConfigs, footerMaxLength, footerMinLength);

			return instance.question;
		});
}

export function combineCommitMessage(answers: Answers): string {
	// TODO signed-off-by
	const maxLineLength = getMaxLength(getRule("footer", "max-line-length"));
	const leadingBlankFn = getLeadingBlankFn(getRule("footer", "leading-blank"));

	const { footer, breaking, issues } = answers;
	const footerNotes: string[] = [];

	if (breaking) {
		const BREAKING_CHANGE = "BREAKING CHANGE: ";
		const message = BREAKING_CHANGE + breaking.replace(new RegExp(`^${BREAKING_CHANGE}`), "");
		footerNotes.push(
			maxLineLength < Infinity
				? wrap(message, {
						width: maxLineLength,
						trim: true,
						indent: "",
					})
				: message.trim(),
		);
	}

	if (issues) {
		footerNotes.push(
			maxLineLength < Infinity
				? wrap(issues, {
						width: maxLineLength,
						trim: true,
						indent: "",
					})
				: issues.trim(),
		);
	}

	if (footer) {
		footerNotes.push(
			maxLineLength < Infinity
				? wrap(footer, {
						width: maxLineLength,
						trim: true,
						indent: "",
					})
				: footer,
		);
	}

	return leadingBlankFn(footerNotes.join("\n"));
}
