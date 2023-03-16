import parse from '@commitlint/parse';
import {subjectFullStop} from './subject-full-stop';

const messages = {
	empty: 'test:\n',
	with: `test: subject.\n`,
	without: `test: subject\n`,
	standardScopeWith: `type(scope): subject.\n`,
	nonStandardScopeWith: 'type.scope: subject.\n',
};

const parsed = {
	empty: parse(messages.empty),
	with: parse(messages.with),
	without: parse(messages.without),
	standardScopeWith: parse(messages.standardScopeWith),
	nonStandardScopeWith: parse(messages.nonStandardScopeWith),
};

test('empty against "always" should succeed', async () => {
	const [actual] = subjectFullStop(await parsed.empty, 'always', '.');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('empty against "never ." should succeed', async () => {
	const [actual] = subjectFullStop(await parsed.empty, 'never', '.');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "always ." should succeed', async () => {
	const [actual] = subjectFullStop(await parsed.with, 'always', '.');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "never ." should fail', async () => {
	const [actual] = subjectFullStop(await parsed.with, 'never', '.');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "always ." should fail', async () => {
	const [actual] = subjectFullStop(await parsed.without, 'always', '.');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "never ." should succeed', async () => {
	const [actual] = subjectFullStop(await parsed.without, 'never', '.');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('commit message title with standard scope and full-stop against "never ." should fail', async () => {
	const [actual] = subjectFullStop(
		await parsed.standardScopeWith,
		'never',
		'.'
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('commit message title with non standard scope and full-stop against "never ." should fail', async () => {
	const [actual] = subjectFullStop(
		await parsed.nonStandardScopeWith,
		'never',
		'.'
	);
	const expected = false;
	expect(actual).toEqual(expected);
});
