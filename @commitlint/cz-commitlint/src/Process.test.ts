import {describe, test, expect, vi, beforeEach, afterEach} from 'vitest';
import {
	QualifiedRules,
	RuleConfigSeverity,
	UserPromptConfig,
} from '@commitlint/types';
import {Answers, DistinctQuestion} from 'inquirer';
import isFunction from 'lodash.isfunction';

import process from './Process.js';

const mockShowTitle = vi.fn();
const mockShowValidation = vi.fn((message) => message);

// mock inquirer
const mockPrompt = vi.fn(async function (
	questions: DistinctQuestion[],
	answers: Answers,
) {
	for (const {name, message, when, filter, validate} of questions) {
		if (typeof when !== 'function' || (await when(answers))) {
			const title =
				message && isFunction(message)
					? await message(answers)
					: typeof message === 'string'
						? message
						: '';
			mockShowTitle(title);

			const validation =
				typeof validate !== 'function' ||
				(await validate((name && answers[name]) ?? '', answers));

			if (typeof validation === 'string') {
				mockShowValidation(validation);
				break;
			} else if (filter && name && answers[name]) {
				answers[name] = filter(answers[name], answers);
			}
		}
	}
});

function InquirerFactory(answers: Answers) {
	const inquirer = {
		async prompt(questions: DistinctQuestion[]) {
			await mockPrompt(questions, answers);
			return answers;
		},
	};

	return inquirer;
}

const MESSAGES = {
	skip: '(press enter to skip)',
	max: 'upper %d chars',
	min: '%d chars at least',
	emptyWarning: '%s can not be empty',
	upperLimitWarning: '%s: %s over limit %d',
	lowerLimitWarning: '%s: %s below limit %d',
};

let rules: QualifiedRules;
let prompts: UserPromptConfig;

afterEach(() => {
	mockShowTitle.mockClear();
	mockShowValidation.mockClear();
});

describe('conventional-changlog', () => {
	beforeEach(() => {
		rules = {
			'body-leading-blank': [RuleConfigSeverity.Warning, 'always'],
			'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
			'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'],
			'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
			'header-max-length': [RuleConfigSeverity.Error, 'always', 100],
			'subject-case': [
				RuleConfigSeverity.Error,
				'never',
				['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
			],
			'subject-empty': [RuleConfigSeverity.Error, 'never'],
			'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'],
			'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
			'type-empty': [RuleConfigSeverity.Error, 'never'],
			'type-enum': [
				RuleConfigSeverity.Error,
				'always',
				[
					'build',
					'chore',
					'ci',
					'docs',
					'feat',
					'fix',
					'perf',
					'refactor',
					'revert',
					'style',
					'test',
				],
			],
		};
		prompts = {
			messages: MESSAGES,
			questions: {
				type: {
					description: "Select the type of change that you're committing:",
					enum: {
						feat: {
							description: 'A new feature',
							title: 'Features',
							emoji: '✨',
						},
						fix: {
							description: 'A bug fix',
							title: 'Bug Fixes',
							emoji: '🐛',
						},
						docs: {
							description: 'Documentation only changes',
							title: 'Documentation',
							emoji: '📚',
						},
						style: {
							description:
								'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
							title: 'Styles',
							emoji: '💎',
						},
						refactor: {
							description:
								'A code change that neither fixes a bug nor adds a feature',
							title: 'Code Refactoring',
							emoji: '📦',
						},
						perf: {
							description: 'A code change that improves performance',
							title: 'Performance Improvements',
							emoji: '🚀',
						},
						test: {
							description: 'Adding missing tests or correcting existing tests',
							title: 'Tests',
							emoji: '🚨',
						},
						build: {
							description:
								'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
							title: 'Builds',
							emoji: '🛠',
						},
						ci: {
							description:
								'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
							title: 'Continuous Integrations',
							emoji: '⚙️',
						},
						chore: {
							description: "Other changes that don't modify src or test files",
							title: 'Chores',
							emoji: '♻️',
						},
						revert: {
							description: 'Reverts a previous commit',
							title: 'Reverts',
							emoji: '🗑',
						},
					},
				},
				scope: {
					description:
						'What is the scope of this change (e.g. component or file name)',
				},
				subject: {
					description:
						'Write a short, imperative tense description of the change',
				},
				body: {
					description: 'Provide a longer description of the change',
				},
				isBreaking: {
					description: 'Are there any breaking changes?',
				},
				breakingBody: {
					description:
						'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
				},
				breaking: {
					description: 'Describe the breaking changes',
				},
				isIssueAffected: {
					description: 'Does this change affect any open issues?',
				},
				issuesBody: {
					description:
						'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
				},
				issues: {
					description: 'Add issue references (e.g. "fix #123", "re #123".)',
				},
			},
		};
	});
	test('should process works well', () => {
		const answers = {
			type: 'refactor',
			scope: 'prompt',
			subject: 'refactor prompt based on inquirer',
			body: 'inspired by commitizen/cz-conventional-changelog',
			isBreaking: true,
			breaking: 'refactor types',
			isIssueAffected: true,
			issues: 'https://github.com/conventional-changelog/commitlint/issues/94',
		};
		return process(rules, prompts, InquirerFactory(answers)).then(
			(commitMessage) => {
				expect(commitMessage).toBe(
					'refactor(prompt): refactor prompt based on inquirer\n\ninspired by commitizen/cz-conventional-changelog\n\nBREAKING CHANGE: refactor types\nhttps://github.com/conventional-changelog/commitlint/issues/94',
				);
			},
		);
	});

	test('should show validation and stop process when subject is empty', () => {
		const answers = {
			type: 'refactor',
			scope: 'prompt',
			body: 'inspired by commitizen/cz-conventional-changelog',
			isBreaking: true,
			breaking: 'refactor types',
			isIssueAffected: true,
			issues: 'https://github.com/conventional-changelog/commitlint/issues/94',
		};
		return process(rules, prompts, InquirerFactory(answers)).then(() => {
			expect(mockShowValidation).toHaveBeenCalledWith(
				'subject can not be empty',
			);
			expect(mockShowTitle).toHaveBeenCalledTimes(3);
		});
	});
});
