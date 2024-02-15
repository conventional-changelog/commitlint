import {describe, test, expect, beforeEach} from 'vitest';
import {RuleConfigSeverity} from '@commitlint/types';

import {combineCommitMessage, getQuestions} from './SectionFooter.js';
import {setPromptConfig} from './store/prompts.js';
import {setRules} from './store/rules.js';

beforeEach(() => {
	setRules({});
	setPromptConfig({});
});
describe('getQuestions', () => {
	test('should only ask questions that listed in prompt question config', () => {
		setPromptConfig({
			questions: {
				footer: {
					description:
						'<footer> holds further meta data, such as breaking changes and issue ids',
				},
				issues: {
					description: '<issues> link',
				},
			},
		});

		const questions = getQuestions();

		expect(questions).toHaveLength(2);
		expect(questions).toEqual([
			expect.objectContaining({
				name: 'issues',
			}),
			expect.objectContaining({
				name: 'footer',
			}),
		]);
	});

	test('should not have break change as default', () => {
		setPromptConfig({
			questions: {
				isBreaking: {
					description: 'Are there any breaking changes?',
				},
			},
		});

		const questions = getQuestions();
		expect(questions).toEqual([
			expect.objectContaining({
				name: 'isBreaking',
				default: false,
			}),
		]);
	});

	test('should ask for break change info when have break change', () => {
		setPromptConfig({
			questions: {
				isBreaking: {
					description: 'Are there any breaking changes?',
				},
				breaking: {
					description: 'Describe the breaking changes',
				},
			},
		});

		const questions = getQuestions();
		expect(
			(questions[1].when as any)({
				isBreaking: false,
			})
		).toBe(false);
		expect(
			(questions[1].when as any)({
				isBreaking: true,
			})
		).toBe(true);
	});

	test('should ask for body info when have break change but does not have body message', () => {
		setPromptConfig({
			questions: {
				isBreaking: {
					description: 'Describe the breaking changes',
				},
				breakingBody: {
					description:
						'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
				},
			},
		});

		const questions = getQuestions();

		expect(
			(questions[1].when as any)({
				isBreaking: true,
			})
		).toBe(true);

		expect(
			(questions[1].when as any)({
				isBreaking: true,
				body: 'xxx',
			})
		).toBe(false);

		expect(
			(questions[1].when as any)({
				isBreaking: false,
			})
		).toBe(false);
	});

	test('should change does not affect any issues as default', () => {
		setPromptConfig({
			questions: {
				isIssueAffected: {
					description: 'Does this change affect any open issues?',
				},
			},
		});

		const questions = getQuestions();
		expect(questions).toEqual([
			expect.objectContaining({
				name: 'isIssueAffected',
				default: false,
			}),
		]);
	});

	test('should ask for issue info when have issue affected', () => {
		setPromptConfig({
			questions: {
				isIssueAffected: {
					description: 'Does this change affect any open issues?',
				},
				issues: {
					description: 'Add issue references (e.g. "fix #123", "re #123".)',
				},
			},
		});

		const questions = getQuestions();
		expect(
			(questions[1].when as any)({
				isIssueAffected: false,
			})
		).toBe(false);
		expect(
			(questions[1].when as any)({
				isIssueAffected: true,
			})
		).toBe(true);
	});

	test('should ask for body info when have issue affected but does not have body message', () => {
		setPromptConfig({
			questions: {
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
		});

		const questions = getQuestions();

		expect(
			(questions[1].when as any)({
				isIssueAffected: true,
			})
		).toBe(true);

		expect(
			(questions[1].when as any)({
				isIssueAffected: true,
				body: 'xxx',
			})
		).toBe(false);

		expect(
			(questions[1].when as any)({
				isIssueAffected: false,
				breaking: 'xxxxx',
			})
		).toBe(false);
	});
});

describe('combineCommitMessage', () => {
	test('should return BreakChange start with "BREAKING CHANGE: "', () => {
		let commitMessage = combineCommitMessage({
			breaking: 'BREAKING CHANGE: xxxxxx',
		});
		expect(commitMessage).toBe('BREAKING CHANGE: xxxxxx');

		commitMessage = combineCommitMessage({
			breaking: 'xxxxxx',
		});
		expect(commitMessage).toBe('BREAKING CHANGE: xxxxxx');
	});
	test('should return correct string with BreakChange,issue,footer', () => {
		const commitMessage = combineCommitMessage({
			issues:
				'https://github.com/conventional-changelog/commitlint/issues/2507',
			breaking: 'BREAKING CHANGE: xxxxxx',
			footer: 'Other footer information.',
		});
		expect(commitMessage).toBe(
			'BREAKING CHANGE: xxxxxx\nhttps://github.com/conventional-changelog/commitlint/issues/2507\nOther footer information.'
		);
	});

	test('should return wrap string with footer-max-line-length', () => {
		setRules({
			'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 10],
		});
		const commitMessage = combineCommitMessage({
			issues:
				'https://github.com/conventional-changelog/commitlint/issues/2507',
			breaking: 'BREAKING CHANGE: xxxxxx',
			footer: 'Other footer information.',
		});
		expect(commitMessage).toBe(
			'BREAKING\nCHANGE:\nxxxxxx\nhttps://github.com/conventional-changelog/commitlint/issues/2507\nOther\nfooter\ninformation.'
		);
	});

	test('should auto leading blank when footer-leading-blank is set', () => {
		setRules({
			'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 10],
			'footer-leading-blank': [RuleConfigSeverity.Error, 'always'],
		});
		const commitMessage = combineCommitMessage({
			issues:
				'https://github.com/conventional-changelog/commitlint/issues/2507',
			breaking: 'BREAKING CHANGE: xxxxxx',
			footer: 'Other footer information.',
		});
		expect(commitMessage).toBe(
			'\nBREAKING\nCHANGE:\nxxxxxx\nhttps://github.com/conventional-changelog/commitlint/issues/2507\nOther\nfooter\ninformation.'
		);
	});

	test('when does not have break change', () => {
		const commitMessage = combineCommitMessage({
			issues:
				'https://github.com/conventional-changelog/commitlint/issues/2507',
			footer: 'Other footer information.',
		});
		expect(commitMessage).toBe(
			'https://github.com/conventional-changelog/commitlint/issues/2507\nOther footer information.'
		);
	});

	test('when does not have issue', () => {
		const commitMessage = combineCommitMessage({
			footer: 'Other footer information.',
		});
		expect(commitMessage).toBe('Other footer information.');
	});
});

describe('FooterQuestion', () => {
	test('should limited by footer maxLength and minLength', () => {
		setRules({
			'footer-max-length': [RuleConfigSeverity.Error, 'always', 30],
			'footer-min-length': [RuleConfigSeverity.Error, 'always', 10],
		});
		setPromptConfig({
			messages: {
				skip: '(press enter to skip)',
				max: 'upper %d chars',
				min: '%d chars at least',
				emptyWarning: '%s can not be empty',
				upperLimitWarning: '%s: %s over limit %d',
				lowerLimitWarning: '%s: %s below limit %d',
			},
			questions: {
				breaking: {
					description: 'Describe the breaking changes',
				},
				issues: {
					description: '<issues> link',
				},
				footer: {
					description:
						'<footer> holds further meta data, such as breaking changes and issue ids',
				},
			},
		});

		const questions = getQuestions();
		const answers = {
			breaking: 'BREAKING CHANGE: xxxxxx',
			issues: ''.padEnd(6, 'y'),
		};

		const lastQuestion = questions[2];

		(lastQuestion.message as any)(answers);
		expect(lastQuestion?.validate?.(''.padEnd(10, 'z'), answers)).toBe(
			'footer: footer over limit 11'
		);
	});
});
