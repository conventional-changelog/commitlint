import * as prompts from './prompts';

let getPromptQuestions: typeof prompts.getPromptQuestions;
let getPromptMessages: typeof prompts.getPromptMessages;
let getPromptSettings: typeof prompts.getPromptSettings;
let setPromptConfig: typeof prompts.setPromptConfig;

beforeEach(() => {
	jest.resetModules();
	getPromptSettings = require('./prompts').getPromptSettings;
	getPromptMessages = require('./prompts').getPromptMessages;
	getPromptQuestions = require('./prompts').getPromptQuestions;
	setPromptConfig = require('./prompts').setPromptConfig;
});
describe('setPromptConfig', () => {
	test('should cover questions when prompt config questions is plain object', () => {
		const promptConfig = {
			questions: {
				type: {
					description: 'input type',
				},
			},
		};
		setPromptConfig(promptConfig);
		expect(getPromptQuestions()).toBe(promptConfig.questions);
	});

	test('should not set questions when prompt config questions is not a plain object', () => {
		const initialQuestions = {...getPromptQuestions()};
		setPromptConfig({
			questions: null,
		} as any);
		expect(getPromptQuestions()).toEqual(initialQuestions);

		setPromptConfig({
			questions: 'questions',
		} as any);
		expect(getPromptQuestions()).toEqual(initialQuestions);

		setPromptConfig({
			questions: [1, 2, 3],
		} as any);
		expect(getPromptQuestions()).toEqual(initialQuestions);
	});

	test('should merge message when prompt config message is string', () => {
		const initialMessages = {...getPromptMessages()};
		const promptConfig = {
			messages: {
				emptyWarning: '(%s can not be empty)',
			},
		};
		setPromptConfig(promptConfig);

		expect(getPromptMessages()['emptyWarning']).toBe(
			promptConfig.messages.emptyWarning
		);
		expect(getPromptMessages()['lowerLimitWarning']).toBe(
			initialMessages['lowerLimitWarning']
		);
	});

	test('should not merge message when prompt config message is not a string', () => {
		const initialMessages = {...getPromptMessages()};
		const promptConfig = {
			messages: {
				emptyWarning: '(%s can not be empty)',
				min: function () {
					return 'min:';
				},
			},
		};
		setPromptConfig(promptConfig as any);

		expect(getPromptMessages()['emptyWarning']).toBe(
			promptConfig.messages.emptyWarning
		);
		expect(getPromptMessages()['min']).toBe(initialMessages['min']);
	});

	test('should ignore non-essential message', () => {
		const initialMessages = {...getPromptMessages()};
		const promptConfig = {
			messages: {
				more: 'learn more',
			},
		};
		setPromptConfig(promptConfig);
		expect(getPromptMessages()).toEqual(initialMessages);
	});

	test('should fields be independent', () => {
		const initialQuestions = {...getPromptQuestions()};
		setPromptConfig({
			messages: {
				emptyWarning: '(%s can not be empty)',
			},
		});
		expect(getPromptQuestions()).toEqual(initialQuestions);

		const initialMessages = {...getPromptMessages()};
		setPromptConfig({
			questions: {
				type: {
					description: 'input type',
				},
			},
		});
		expect(getPromptMessages()).toEqual(initialMessages);
	});

	test('should settings scopeEnumSeparator be set when value is ",\\/"', () => {
		setPromptConfig({
			settings: {
				scopeEnumSeparator: '/',
			},
		});
		expect(getPromptSettings()['scopeEnumSeparator']).toEqual('/');

		const processExit = jest
			.spyOn(process, 'exit')
			.mockImplementation(() => undefined as never);
		setPromptConfig({
			settings: {
				scopeEnumSeparator: '-',
			},
		});
		expect(processExit).toHaveBeenCalledWith(1);
		processExit.mockClear();
	});

	test('should pass on settings', () => {
		setPromptConfig({
			settings: {
				enableMultipleScopes: true,
			},
		});
		expect(getPromptSettings()['enableMultipleScopes']).toEqual(true);
	});
});
