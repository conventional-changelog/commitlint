import {Answers, PromptModule, QuestionCollection} from 'inquirer';
/// <reference path="./inquirer/inquirer.d.ts" />
import {input} from './input';
import chalk from 'chalk';

jest.mock(
	'@commitlint/load',
	() => {
		return () => require('@commitlint/config-angular');
	},
	{
		virtual: true,
	}
);

test('should work with all fields filled', async () => {
	const prompt = stub({
		'input-custom': {
			type: 'fix',
			scope: 'test',
			subject: 'subject',
			body: 'body',
			footer: 'footer',
		},
	});
	const message = await input(prompt);
	expect(message).toEqual('fix(test): subject\n' + 'body\n' + 'footer');
});

test('should work without scope', async () => {
	const prompt = stub({
		'input-custom': {
			type: 'fix',
			scope: '',
			subject: 'subject',
			body: 'body',
			footer: 'footer',
		},
	});
	const message = await input(prompt);
	expect(message).toEqual('fix: subject\n' + 'body\n' + 'footer');
});

test('should fail without type', async () => {
	const spy = jest.spyOn(console, 'error').mockImplementation();
	const prompt = stub({
		'input-custom': {
			type: '',
			scope: '',
			subject: '',
			body: '',
			footer: '',
		},
	});
	const message = await input(prompt);
	expect(message).toEqual('');
	expect(console.error).toHaveBeenCalledTimes(1);
	expect(console.error).toHaveBeenLastCalledWith(
		new Error(`⚠ ${chalk.bold('type')} may not be empty.`)
	);
	spy.mockRestore();
});

function stub(config: Record<string, Record<string, unknown>>): PromptModule {
	const prompt = async (questions: QuestionCollection): Promise<any> => {
		const result: Answers = {};
		const resolvedConfig = Array.isArray(questions) ? questions : [questions];
		for (const promptConfig of resolvedConfig) {
			const configType = promptConfig.type || 'input';
			const questions = config[configType];
			if (!questions) {
				throw new Error(`Unexpected config type: ${configType}`);
			}
			const answer = questions[promptConfig.name!];
			if (answer == null) {
				throw new Error(`Unexpected config name: ${promptConfig.name}`);
			}
			const validate = promptConfig.validate;
			if (validate) {
				const validationResult = validate(answer, result);
				if (validationResult !== true) {
					throw new Error(validationResult || undefined);
				}
			}

			result[promptConfig.name!] = answer;
		}
		return result;
	};
	prompt.registerPrompt = () => {
		return prompt;
	};
	prompt.restoreDefaultPrompts = () => true;
	prompt.prompts = {};
	return prompt as any as PromptModule;
}
