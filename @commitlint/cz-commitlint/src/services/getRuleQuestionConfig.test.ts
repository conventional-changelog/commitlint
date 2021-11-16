import {RuleConfigSeverity} from '@commitlint/types';
import {setPromptConfig} from '../store/prompts';
import {setRules} from '../store/rules';
import getRuleQuestionConfig from './getRuleQuestionConfig';

// let rules = {};

// let rules: QualifiedRules = {};
// const getRules = jest.fn().mockReturnValue(rules);

describe('empty rule', () => {
	test('should return null when must be empty', () => {
		setRules({
			'body-empty': [RuleConfigSeverity.Error, 'always'],
		});
		expect(getRuleQuestionConfig('body')).toBe(null);
	});

	test("should field 'skip' be false when can not be empty", () => {
		setRules({
			'body-empty': [RuleConfigSeverity.Error, 'never'],
		});
		expect(getRuleQuestionConfig('body')?.skip).toBe(false);
	});

	test('should field "skip" be true when not set empty rule', () => {
		setRules({
			'body-case': [RuleConfigSeverity.Warning, 'never', 'camel-case'],
			'body-max-length': [RuleConfigSeverity.Error, 'always', 100],
		});
		expect(getRuleQuestionConfig('body')?.skip).toBe(true);
	});

	test('should field "skip" be true when disable empty rule', () => {
		setRules({
			'body-empty': [RuleConfigSeverity.Disabled],
		});

		expect(getRuleQuestionConfig('body')?.skip).toBe(true);

		setRules({
			'body-empty': [RuleConfigSeverity.Disabled, 'always'],
		});
		expect(getRuleQuestionConfig('body')?.skip).toBe(true);

		setRules({
			'body-empty': [RuleConfigSeverity.Disabled, 'never'],
		});
		expect(getRuleQuestionConfig('body')?.skip).toBe(true);
	});
});

describe('title', () => {
	test("should field 'title' set by 'description config'", () => {
		const TEST_DESC = 'test the description';
		setPromptConfig({
			questions: {
				body: {
					description: TEST_DESC,
				},
			},
		});

		expect(getRuleQuestionConfig('body')?.title).toBe(TEST_DESC);
	});

	test("should field 'title' be default string when without 'description' config", () => {
		setPromptConfig({
			questions: {
				body: {},
			},
		});

		expect(getRuleQuestionConfig('body')?.title).toBe('body:');
	});
});

describe('enum list', () => {
	test('should enumList be undefined when without enum rule', () => {
		setRules({
			'scope-case': [RuleConfigSeverity.Warning, 'never', 'camel-case'],
		});

		expect(getRuleQuestionConfig('scope')?.enumList).toBeUndefined();
	});

	test('should enumList be undefined when enum rule is not active', () => {
		setRules({
			'scope-enum': [RuleConfigSeverity.Disabled],
		});
		expect(getRuleQuestionConfig('scope')?.enumList).toBeUndefined();

		setRules({
			'scope-enum': [
				RuleConfigSeverity.Error,
				'never',
				['cli', 'core', 'lint'],
			],
		});
		expect(getRuleQuestionConfig('scope')?.enumList).toBeUndefined();

		setRules({
			'scope-enum': [RuleConfigSeverity.Error, 'always'],
		} as any);
		expect(getRuleQuestionConfig('scope')?.enumList).toBeUndefined();
	});

	test('should enumList be undefined when enum rule is not a array', () => {
		setRules({
			'scope-enum': [RuleConfigSeverity.Error, 'always', {}],
		} as any);

		expect(getRuleQuestionConfig('scope')?.enumList).toBeUndefined();
	});

	test("should enumList same with enum rule when without 'enum' config", () => {
		const ENUM_RULE_LIST = ['cli', 'core', 'lint'];
		setRules({
			'scope-enum': [RuleConfigSeverity.Error, 'always', ENUM_RULE_LIST],
		} as any);

		setPromptConfig({
			questions: {
				scope: {
					description: 'test scope',
				},
			},
		});

		const enumList = getRuleQuestionConfig('scope')?.enumList;
		expect(enumList).not.toBe(ENUM_RULE_LIST);
		expect(enumList).toEqual(ENUM_RULE_LIST);
	});

	test('should enumList item concat description', () => {
		const ENUM_RULE_LIST = ['cli', 'core', 'lint'];
		setRules({
			'scope-enum': [RuleConfigSeverity.Error, 'always', ENUM_RULE_LIST],
		} as any);

		setPromptConfig({
			questions: {
				scope: {
					description: 'test scope',
					enum: {
						cli: {
							description: 'CLI',
						},
						core: {
							description: 'CORE',
						},
						lint: {},
					},
				},
			},
		});

		const enumList = getRuleQuestionConfig('scope')?.enumList;
		expect(enumList).toHaveLength(3);
		expect(enumList).toEqual([
			{
				name: expect.stringMatching(/cli:[\s]*CLI/),
				value: 'cli',
				short: 'cli',
			},
			{
				name: expect.stringMatching(/core:[\s]*CORE/),
				value: 'core',
				short: 'core',
			},
			'lint',
		]);
	});

	test('should enumList item padding format with 4 blank', () => {
		const LONGEST = 12;
		const longestItem = ''.padEnd(LONGEST, 'x');
		const enumRuleList = ['cli', 'core', longestItem];
		setRules({
			'scope-enum': [RuleConfigSeverity.Error, 'always', enumRuleList],
		} as any);

		setPromptConfig({
			questions: {
				scope: {
					description: 'test scope',
					enum: {
						cli: {
							description: 'Test CLI',
						},
						core: {
							description: 'Test CORE',
						},
						[longestItem]: {
							description: 'Test',
						},
					},
				},
			},
		});

		const enumList = getRuleQuestionConfig('scope')?.enumList;
		expect(enumList).toHaveLength(3);
		expect(enumList).toEqual([
			{
				name: expect.stringMatching(
					new RegExp(`^cli:[\\s]{${LONGEST - 4 + 4}}Test CLI$`)
				),
				value: 'cli',
				short: 'cli',
			},
			{
				name: expect.stringMatching(
					new RegExp(`^core:[\\s]{${LONGEST - 5 + 4}}Test CORE$`)
				),
				value: 'core',
				short: 'core',
			},
			{
				name: expect.stringMatching(
					new RegExp(`^${longestItem}:[\\s]{${-1 + 4}}Test$`)
				),
				value: longestItem,
				short: longestItem,
			},
		]);
	});

	test("should enumList item sorted by 'enum' config order", () => {
		const ENUM_RULE_LIST = ['cli', 'core', 'lint'];
		setRules({
			'scope-enum': [RuleConfigSeverity.Error, 'always', ENUM_RULE_LIST],
		} as any);

		setPromptConfig({
			questions: {
				scope: {
					description: 'test scope',
					enum: {
						core: {},
						lint: {},
						cli: {},
					},
				},
			},
		});

		const enumList = getRuleQuestionConfig('scope')?.enumList;
		expect(enumList).toHaveLength(3);
		expect(enumList?.[0]).toBe('core');
		expect(enumList?.[1]).toBe('lint');
		expect(enumList?.[2]).toBe('cli');
	});
});

test('should return correct question config', () => {
	setRules({
		'body-empty': [RuleConfigSeverity.Error, 'never'],
		'body-case': [RuleConfigSeverity.Error, 'always', 'sentence-case'],
		'body-full-stop': [RuleConfigSeverity.Error, 'always', '!'],
		'body-min-length': [RuleConfigSeverity.Error, 'always', 10],
		'body-max-length': [RuleConfigSeverity.Error, 'always', 100],
		'scope-enum': [RuleConfigSeverity.Error, 'always', ['cli', 'core', 'lint']],
	} as any);

	const MESSAGES = {
		skip: ':skip',
		max: 'upper %d chars',
		min: '%d chars at least',
		emptyWarning: 'can not be empty',
		upperLimitWarning: 'over limit',
		lowerLimitWarning: 'below limit',
	};
	setPromptConfig({
		messages: MESSAGES,
		questions: {
			body: {
				description: 'please input body: (Test)',
			},
			scope: {
				description: 'please choose the scope: (Test)',
				enum: {
					core: {
						description: 'CORE',
					},
					lint: {
						description: 'LINT',
					},
					cli: {
						description: 'CLI',
					},
				},
			},
		},
	});

	const scopeQuestionConfig = getRuleQuestionConfig('scope');
	expect(scopeQuestionConfig).toEqual({
		skip: true,
		title: 'please choose the scope: (Test)',
		messages: MESSAGES,
		minLength: 0,
		maxLength: Infinity,
		enumList: [
			{
				name: 'core:   CORE',
				value: 'core',
				short: 'core',
			},
			{
				name: 'lint:   LINT',
				value: 'lint',
				short: 'lint',
			},
			{
				name: 'cli:    CLI',
				value: 'cli',
				short: 'cli',
			},
		],
		caseFn: expect.any(Function),
		fullStopFn: expect.any(Function),
	});
	expect(scopeQuestionConfig?.caseFn?.('xxxx')).toBe('xxxx');
	expect(scopeQuestionConfig?.fullStopFn?.('xxxx')).toBe('xxxx');

	const bodyQuestionConfig = getRuleQuestionConfig('body');
	expect(bodyQuestionConfig).toEqual({
		skip: false,
		title: 'please input body: (Test)',
		messages: MESSAGES,
		minLength: 10,
		maxLength: 100,
		enumList: undefined,
		caseFn: expect.any(Function),
		fullStopFn: expect.any(Function),
	});
	expect(bodyQuestionConfig?.caseFn?.('xxxx')).toBe('Xxxx');
	expect(bodyQuestionConfig?.fullStopFn?.('xxxx')).toBe('xxxx!');
});
