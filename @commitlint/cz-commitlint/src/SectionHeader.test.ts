import {RuleConfigSeverity} from '@commitlint/types';
import {
	combineCommitMessage,
	getQuestions,
	getQuestionConfig,
} from './SectionHeader';
import {setPromptConfig} from './store/prompts';
import {setRules} from './store/rules';

beforeEach(() => {
	setRules({});
	setPromptConfig({});
});
describe('getQuestions', () => {
	test("should contain 'type','scope','subject'", () => {
		const questions = getQuestions();
		expect(questions).toHaveLength(3);
		expect(questions).toEqual([
			expect.objectContaining({
				name: 'type',
			}),
			expect.objectContaining({
				name: 'scope',
			}),
			expect.objectContaining({
				name: 'subject',
			}),
		]);
	});

	test('should exclude question when must be empty', () => {
		setRules({
			'scope-empty': [RuleConfigSeverity.Error, 'always'],
		});
		const questions = getQuestions();
		expect(questions).toHaveLength(2);
		expect(questions).toEqual([
			expect.objectContaining({
				name: 'type',
			}),
			expect.objectContaining({
				name: 'subject',
			}),
		]);
	});
});

describe('getQuestionConfig', () => {
	test("should 'scope' supports multiple items separated with ',\\/'", () => {
		const config = getQuestionConfig('scope');
		expect(config).toEqual(
			expect.objectContaining({
				multipleValueDelimiters: /\/|\\|,/g,
			}),
		);
	});

	test("should 'scope' supports multiple select separated with settings.scopeEnumSeparator and enableMultipleScopes", () => {
		setPromptConfig({
			settings: {
				scopeEnumSeparator: '/',
				enableMultipleScopes: true,
			},
		});
		const config = getQuestionConfig('scope');
		expect(config).toEqual(
			expect.objectContaining({
				multipleSelectDefaultDelimiter: '/',
			}),
		);
	});

	test("should 'scope' disable multiple select by default", () => {
		const config = getQuestionConfig('scope');
		expect(config).not.toContain('multipleSelectDefaultDelimiter');
	});
});

describe('combineCommitMessage', () => {
	test('should return correct string when type,scope,subject are not empty', () => {
		const commitMessage = combineCommitMessage({
			type: 'build',
			scope: 'typescript',
			subject: 'update tsconfig.json',
		});
		expect(commitMessage).toBe('build(typescript): update tsconfig.json');
	});
	test('when type is empty', () => {
		let commitMessage = combineCommitMessage({
			scope: 'typescript',
			subject: 'update tsconfig.json',
		});
		expect(commitMessage).toBe('(typescript): update tsconfig.json');

		commitMessage = combineCommitMessage({
			scope: 'typescript',
		});
		expect(commitMessage).toBe('(typescript)');
	});

	test('when scope is empty', () => {
		let commitMessage = combineCommitMessage({
			type: 'build',
			subject: 'update tsconfig.json',
		});
		expect(commitMessage).toBe('build: update tsconfig.json');

		commitMessage = combineCommitMessage({
			subject: 'update tsconfig.json',
		});
		expect(commitMessage).toBe('update tsconfig.json');
	});

	test('when subject is empty', () => {
		const commitMessage = combineCommitMessage({
			type: 'build',
			scope: 'typescript',
		});
		expect(commitMessage).toBe('build(typescript)');
	});
});

describe('HeaderQuestion', () => {
	test('should limited by header maxLength and minLength', () => {
		setRules({
			'header-max-length': [RuleConfigSeverity.Error, 'always', 20],
			'header-min-length': [RuleConfigSeverity.Error, 'always', 10],
			'subject-max-length': [RuleConfigSeverity.Error, 'always', 10],
			'subject-min-length': [RuleConfigSeverity.Error, 'always', 5],
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
		});

		const questions = getQuestions();
		const answers = {
			type: ''.padEnd(8, 'x'),
			scope: ''.padEnd(6, 'y'),
		};

		const lastQuestion = questions[2];
		(lastQuestion.message as any)(answers);
		expect(lastQuestion?.validate?.(''.padEnd(10, 'z'), answers)).toBe(
			'subject: subject over limit 6',
		);
	});
});
