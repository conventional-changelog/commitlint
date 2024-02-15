import {QualifiedRules} from '@commitlint/types';

import type {Rule} from '../types.js';

const storeKey = Symbol('rules');

const store: {
	[storeKey]: QualifiedRules;
} = {
	[storeKey]: {},
};

export function getRule(key: string, property: string): Rule | undefined {
	if (key.split('-').length > 1) {
		return;
	}
	return store[storeKey][`${key}-${property}`];
}

export function setRules(newRules: QualifiedRules): void {
	store[storeKey] = newRules;
}

export type GetRuleMethod = typeof getRule;
export type SetRulesMethod = typeof setRules;
