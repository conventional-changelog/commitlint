import {PromptConfig, UserPromptConfig} from '@commitlint/types';
import isPlainObject from 'lodash/isPlainObject';
import defaultPromptConfigs from './defaultPromptConfigs';

const storeKey = Symbol('promptConfig');

const store: {
	[storeKey]: PromptConfig;
} = {
	[storeKey]: defaultPromptConfigs,
};

export function setPromptConfig(newPromptConfig: UserPromptConfig): void {
	const {messages, questions} = newPromptConfig;
	if (messages) {
		const requiredMessageKeys = Object.keys(defaultPromptConfigs.messages);
		requiredMessageKeys.forEach((key: string) => {
			const message = messages[key];
			if (typeof message === 'string') {
				store[storeKey]['messages'][key] = message;
			}
		});
	}

	if (questions && isPlainObject(questions)) {
		store[storeKey]['questions'] = questions;
	}
}

export function getPromptMessages(): Readonly<PromptConfig['messages']> {
	return (store[storeKey] && store[storeKey]['messages']) ?? {};
}

export function getPromptQuestions(): Readonly<PromptConfig['questions']> {
	return (store[storeKey] && store[storeKey]['questions']) ?? {};
}
