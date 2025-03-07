import {test, expect} from 'vitest';
import parse from '@commitlint/parse';
import type {Commit} from 'conventional-commits-parser';

import {headerTrim} from './header-trim.js';

const messages = {
	correct: 'test: subject',

	whitespaceStart: ' test: subject',
	whitespaceEnd: 'test: subject  ',
	whitespaceSurround: ' test: subject ',

	tabStart: '\t\ttest: subject',
	tabEnd: 'test: subject\t\t',
	tabSurround: '\t\ttest: subject\t',

	mixStart: '\t\ttest: subject',
	mixEnd: 'test: subject\t\t',
	mixSurround: '\t \ttest: subject \t  \t',
};

const parsed = Object.entries(messages).reduce(
	(_parsed, [key, message]) =>
		Object.assign(_parsed, {
			[key]: parse(message),
		}),
	{} as Record<keyof typeof messages, Promise<Commit>>,
);

test('should succeed when header is not surrounded by whitespace', async () => {
	const result = headerTrim(await parsed.correct);
	expect(result).toEqual(expect.arrayContaining([true]));
});

test.each([
	{scenario: 'mixed whitespace ', commit: parsed.mixStart},
	{scenario: 'whitespace', commit: parsed.whitespaceStart},
	{scenario: 'tab', commit: parsed.tabStart},
] as const)('should fail when starts with $scenario', async ({commit}) => {
	const result = headerTrim(await commit);
	expect(result).toEqual(
		expect.arrayContaining([false, 'header must not start with whitespace']),
	);
});

test.each([
	{scenario: 'mixed whitespace', commit: parsed.mixEnd},
	{scenario: 'whitespace', commit: parsed.whitespaceEnd},
	{scenario: 'tab', commit: parsed.tabEnd},
] as const)('should fail when ends with $scenario', async ({commit}) => {
	const result = headerTrim(await commit);
	expect(result).toEqual(
		expect.arrayContaining([false, 'header must not end with whitespace']),
	);
});

test.each([
	{scenario: 'mixed whitespace', commit: parsed.mixSurround},
	{scenario: 'whitespace', commit: parsed.whitespaceSurround},
	{scenario: 'tab', commit: parsed.tabSurround},
] as const)(
	'should fail when surrounded by with $scenario',
	async ({commit}) => {
		const result = headerTrim(await commit);
		expect(result).toEqual(
			expect.arrayContaining([
				false,
				'header must not be surrounded by whitespace',
			]),
		);
	},
);
