import {PromptConfig, UserPromptConfig} from '@commitlint/types';
import isPlainObject from 'lodash.isplainobject';
import defaultPromptConfigs from './defaultPromptConfigs';

const storeKey = Symbol('promptConfig');

const store: {
	[storeKey]: PromptConfig;
} = {
	[storeKey]: defaultPromptConfigs,
};

export function setPromptConfig(newPromptConfig: UserPromptConfig): void {
	const {settings, messages, questions} = newPromptConfig;
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

	if (settings && isPlainObject(settings)) {
		if (
			settings['scopeEnumSeparator'] &&
			!/^\/|\\|,$/.test(settings['scopeEnumSeparator'])
		) {
			console.log(
				`prompt.settings.scopeEnumSeparator must be one of ',', '\\', '/'.`
			);
			process.exit(1);
		}
		store[storeKey]['settings'] = {
			...defaultPromptConfigs.settings,
			...settings,
		};
	}
}

export function getPromptMessages(): Readonly<PromptConfig['messages']> {
	return (store[storeKey] && store[storeKey]['messages']) ?? {};
}

export function getPromptQuestions(): Readonly<PromptConfig['questions']> {
	return (store[storeKey] && store[storeKey]['questions']) ?? {};
}

export function getPromptSettings(): Readonly<PromptConfig['settings']> {
	return (store[storeKey] && store[storeKey]['settings']) ?? {};
}
