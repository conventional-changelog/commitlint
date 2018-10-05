import test from 'ava';
import parse from '@commitlint/parse';
import subjectCase from './subject-case';

const messages = {
	empty: 'test:\n',
	numeric: 'test: 1.0.0',
	lowercase: 'test: subject',
	mixedcase: 'test: sUbJeCt',
	uppercase: 'test: SUBJECT',
	camelcase: 'test: subJect',
	kebabcase: 'test: sub-ject',
	pascalcase: 'test: SubJect',
	snakecase: 'test: sub_ject',
	startcase: 'test: Sub Ject'
};

const parsed = {
	empty: parse(messages.empty),
	numeric: parse(messages.numeric),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase),
	camelcase: parse(messages.camelcase),
	kebabcase: parse(messages.kebabcase),
	pascalcase: parse(messages.pascalcase),
	snakecase: parse(messages.snakecase),
	startcase: parse(messages.startcase)
};

test('with empty subject should succeed for "never lowercase"', async t => {
	const [actual] = subjectCase(await parsed.empty, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty subject should succeed for "always lowercase"', async t => {
	const [actual] = subjectCase(await parsed.empty, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty subject should succeed for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty subject should succeed for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with lowercase subject should fail for "never lowercase"', async t => {
	const [actual] = subjectCase(await parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase subject should succeed for "always lowercase"', async t => {
	const [actual] = subjectCase(await parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should succeed for "never lowercase"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should fail for "always lowercase"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with mixedcase subject should succeed for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should fail for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with uppercase subject should fail for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase subject should succeed for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with camelcase subject should fail for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.camelcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase subject should succeed for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.camelcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with camelcase subject should fail for "always pascalcase"', async t => {
	const [actual] = subjectCase(await parsed.camelcase, 'always', 'pascal-case');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase subject should fail for "always kebabcase"', async t => {
	const [actual] = subjectCase(await parsed.camelcase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase subject should fail for "always snakecase"', async t => {
	const [actual] = subjectCase(await parsed.camelcase, 'always', 'snake-case');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase subject should succeed for "always camelcase"', async t => {
	const [actual] = subjectCase(await parsed.camelcase, 'always', 'camel-case');
	const expected = true;
	t.is(actual, expected);
});

test('with pascalcase subject should fail for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.pascalcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase subject should succeed for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.pascalcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with pascalcase subject should succeed for "always pascalcase"', async t => {
	const [actual] = subjectCase(
		await parsed.pascalcase,
		'always',
		'pascal-case'
	);
	const expected = true;
	t.is(actual, expected);
});

test('with pascalcase subject should fail for "always kebabcase"', async t => {
	const [actual] = subjectCase(await parsed.pascalcase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase subject should fail for "always snakecase"', async t => {
	const [actual] = subjectCase(await parsed.pascalcase, 'always', 'snake-case');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase subject should fail for "always camelcase"', async t => {
	const [actual] = subjectCase(await parsed.pascalcase, 'always', 'camel-case');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase subject should fail for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.snakecase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase subject should succeed for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.snakecase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with snakecase subject should fail for "always pascalcase"', async t => {
	const [actual] = subjectCase(await parsed.snakecase, 'always', 'pascal-case');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase subject should fail for "always kebabcase"', async t => {
	const [actual] = subjectCase(await parsed.snakecase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase subject should succeed for "always snakecase"', async t => {
	const [actual] = subjectCase(await parsed.snakecase, 'always', 'snake-case');
	const expected = true;
	t.is(actual, expected);
});

test('with snakecase subject should fail for "always camelcase"', async t => {
	const [actual] = subjectCase(await parsed.snakecase, 'always', 'camel-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase subject should fail for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.startcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase subject should succeed for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.startcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with startcase subject should fail for "always pascalcase"', async t => {
	const [actual] = subjectCase(await parsed.startcase, 'always', 'pascal-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase subject should fail for "always kebabcase"', async t => {
	const [actual] = subjectCase(await parsed.startcase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase subject should fail for "always snakecase"', async t => {
	const [actual] = subjectCase(await parsed.startcase, 'always', 'snake-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase subject should fail for "always camelcase"', async t => {
	const [actual] = subjectCase(await parsed.startcase, 'always', 'camel-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase subject should succeed for "always startcase"', async t => {
	const [actual] = subjectCase(await parsed.startcase, 'always', 'start-case');
	const expected = true;
	t.is(actual, expected);
});

test('should use expected message with "always"', async t => {
	const [, message] = subjectCase(
		await parsed.uppercase,
		'always',
		'lower-case'
	);
	t.true(message.indexOf('must be lower-case') > -1);
});

test('should use expected message with "never"', async t => {
	const [, message] = subjectCase(
		await parsed.uppercase,
		'never',
		'upper-case'
	);
	t.true(message.indexOf('must not be upper-case') > -1);
});

test('with uppercase scope should succeed for "always [uppercase, lowercase]"', async t => {
	const [actual] = subjectCase(await parsed.uppercase, 'always', [
		'uppercase',
		'lowercase'
	]);
	const expected = true;
	t.is(actual, expected);
});

test('with lowercase subject should succeed for "always [uppercase, lowercase]"', async t => {
	const [actual] = subjectCase(await parsed.lowercase, 'always', [
		'uppercase',
		'lowercase'
	]);
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase subject should fail for "always [uppercase, lowercase]"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'always', [
		'uppercase',
		'lowercase'
	]);
	const expected = false;
	t.is(actual, expected);
});

test('with mixedcase subject should pass for "always [uppercase, lowercase, camel-case]"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'always', [
		'uppercase',
		'lowercase',
		'camel-case'
	]);
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase scope should pass for "never [uppercase, lowercase]"', async t => {
	const [actual] = subjectCase(await parsed.mixedcase, 'never', [
		'uppercase',
		'lowercase'
	]);
	const expected = true;
	t.is(actual, expected);
});

test('with uppercase scope should fail for "never [uppercase, lowercase]"', async t => {
	const [actual] = subjectCase(await parsed.uppercase, 'never', [
		'uppercase',
		'lowercase'
	]);
	const expected = false;
	t.is(actual, expected);
});

test('with numeric subject should succeed for "never lowercase"', async t => {
	const [actual] = subjectCase(await parsed.numeric, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with numeric subject should succeed for "always lowercase"', async t => {
	const [actual] = subjectCase(await parsed.numeric, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with numeric subject should succeed for "never uppercase"', async t => {
	const [actual] = subjectCase(await parsed.numeric, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with numeric subject should succeed for "always uppercase"', async t => {
	const [actual] = subjectCase(await parsed.numeric, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
