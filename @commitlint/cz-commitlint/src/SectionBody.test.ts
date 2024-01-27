import {RuleConfigSeverity} from '@commitlint/types';

import {combineCommitMessage, getQuestions} from './SectionBody.js';
import {setRules} from './store/rules.js';

describe('getQuestions', () => {
	test('should exclude question when body must be empty', () => {
		setRules({
			'body-empty': [RuleConfigSeverity.Error, 'always'],
		});
		const questions = getQuestions();
		expect(questions).toHaveLength(0);
	});

	test('should only return body question', () => {
		setRules({});
		const questions = getQuestions();
		expect(questions).toHaveLength(1);
		expect(questions).toEqual([
			expect.objectContaining({
				name: 'body',
			}),
		]);
	});
});

describe('combineCommitMessage', () => {
	test('should wrap message to multi lines when max-line-length set', () => {
		setRules({
			'body-max-line-length': [RuleConfigSeverity.Error, 'always', 10],
		});

		const commitMessage = combineCommitMessage({
			body: 'This is the body message.',
		});

		expect(commitMessage).toBe('This is\nthe body\nmessage.');
	});

	test('should auto apply leading blank', () => {
		setRules({
			'body-leading-blank': [RuleConfigSeverity.Error, 'always'],
		});

		const commitMessage = combineCommitMessage({
			body: 'This is the body message.',
		});

		expect(commitMessage).toBe('\nThis is the body message.');
	});

	test('should return correct string when leading-blank and max-line-length both set', () => {
		setRules({
			'body-max-line-length': [RuleConfigSeverity.Error, 'always', 10],
			'body-leading-blank': [RuleConfigSeverity.Error, 'always'],
		});
		const commitMessage = combineCommitMessage({
			body: 'This is the body message.',
		});
		expect(commitMessage).toBe('\nThis is\nthe body\nmessage.');
	});

	test('should use breakingBody when body message is empty but commit has BREAK CHANGE', () => {
		setRules({});
		const commitMessage = combineCommitMessage({
			breakingBody: 'This is breaking body message.',
		});
		expect(commitMessage).toBe('This is breaking body message.');
	});

	test('should use issueBody when body message is empty but commit has issue note', () => {
		setRules({});
		const commitMessage = combineCommitMessage({
			issuesBody: 'This is issue body message.',
		});
		expect(commitMessage).toBe('This is issue body message.');
	});

	test('should use issueBody when body message is empty string but commit has issue note', () => {
		setRules({});
		const commitMessage = combineCommitMessage({
			body: '',
			issuesBody: 'This is issue body message.',
		});
		expect(commitMessage).toBe('This is issue body message.');
	});

	test('should return empty message when body is empty', () => {
		setRules({});
		const commitMessage = combineCommitMessage({
			body: '',
		});
		expect(commitMessage).toBe('');
	});
});
