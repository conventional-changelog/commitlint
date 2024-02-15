import {test, expect} from 'vitest';
import parse from '@commitlint/parse';
import {headerCase} from './header-case.js';

const messages = {
	numeric: '1.0.0\n',
	lowercase: 'header\n',
	mixedcase: 'hEaDeR\n',
	uppercase: 'HEADER\n',
	camelcase: 'heaDer\n',
	kebabcase: 'hea-der\n',
	pascalcase: 'HeaDer\n',
	snakecase: 'hea_der\n',
	startcase: 'Hea Der\n',
};

const parsed = {
	numeric: parse(messages.numeric),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase),
	camelcase: parse(messages.camelcase),
	kebabcase: parse(messages.kebabcase),
	pascalcase: parse(messages.pascalcase),
	snakecase: parse(messages.snakecase),
	startcase: parse(messages.startcase),
};

test('with lowercase header should fail for "never lowercase"', async () => {
	const [actual] = headerCase(await parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with lowercase header should succeed for "always lowercase"', async () => {
	const [actual] = headerCase(await parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase header should succeed for "never lowercase"', async () => {
	const [actual] = headerCase(await parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase header should fail for "always lowercase"', async () => {
	const [actual] = headerCase(await parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase header should succeed for "never uppercase"', async () => {
	const [actual] = headerCase(await parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase header should fail for "always uppercase"', async () => {
	const [actual] = headerCase(await parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with uppercase header should fail for "never uppercase"', async () => {
	const [actual] = headerCase(await parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with lowercase header should succeed for "always uppercase"', async () => {
	const [actual] = headerCase(await parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with camelcase header should fail for "always uppercase"', async () => {
	const [actual] = headerCase(await parsed.camelcase, 'always', 'uppercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase header should succeed for "never uppercase"', async () => {
	const [actual] = headerCase(await parsed.camelcase, 'never', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with camelcase header should fail for "always pascalcase"', async () => {
	const [actual] = headerCase(await parsed.camelcase, 'always', 'pascal-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase header should fail for "always kebabcase"', async () => {
	const [actual] = headerCase(await parsed.camelcase, 'always', 'kebab-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase header should fail for "always snakecase"', async () => {
	const [actual] = headerCase(await parsed.camelcase, 'always', 'snake-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase header should succeed for "always camelcase"', async () => {
	const [actual] = headerCase(await parsed.camelcase, 'always', 'camel-case');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with pascalcase header should fail for "always uppercase"', async () => {
	const [actual] = headerCase(await parsed.pascalcase, 'always', 'uppercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase header should succeed for "never uppercase"', async () => {
	const [actual] = headerCase(await parsed.pascalcase, 'never', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with pascalcase header should succeed for "always pascalcase"', async () => {
	const [actual] = headerCase(await parsed.pascalcase, 'always', 'pascal-case');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with pascalcase header should fail for "always kebabcase"', async () => {
	const [actual] = headerCase(await parsed.pascalcase, 'always', 'kebab-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase header should fail for "always snakecase"', async () => {
	const [actual] = headerCase(await parsed.pascalcase, 'always', 'snake-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase header should fail for "always camelcase"', async () => {
	const [actual] = headerCase(await parsed.pascalcase, 'always', 'camel-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase header should fail for "always uppercase"', async () => {
	const [actual] = headerCase(await parsed.snakecase, 'always', 'uppercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase header should succeed for "never uppercase"', async () => {
	const [actual] = headerCase(await parsed.snakecase, 'never', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with snakecase header should fail for "always pascalcase"', async () => {
	const [actual] = headerCase(await parsed.snakecase, 'always', 'pascal-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase header should fail for "always kebabcase"', async () => {
	const [actual] = headerCase(await parsed.snakecase, 'always', 'kebab-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase header should succeed for "always snakecase"', async () => {
	const [actual] = headerCase(await parsed.snakecase, 'always', 'snake-case');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with snakecase header should fail for "always camelcase"', async () => {
	const [actual] = headerCase(await parsed.snakecase, 'always', 'camel-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase header should fail for "always uppercase"', async () => {
	const [actual] = headerCase(await parsed.startcase, 'always', 'uppercase');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase header should succeed for "never uppercase"', async () => {
	const [actual] = headerCase(await parsed.startcase, 'never', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with startcase header should fail for "always pascalcase"', async () => {
	const [actual] = headerCase(await parsed.startcase, 'always', 'pascal-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase header should fail for "always kebabcase"', async () => {
	const [actual] = headerCase(await parsed.startcase, 'always', 'kebab-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase header should fail for "always snakecase"', async () => {
	const [actual] = headerCase(await parsed.startcase, 'always', 'snake-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase header should fail for "always camelcase"', async () => {
	const [actual] = headerCase(await parsed.startcase, 'always', 'camel-case');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase header should succeed for "always startcase"', async () => {
	const [actual] = headerCase(await parsed.startcase, 'always', 'start-case');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('should use expected message with "always"', async () => {
	const [, message] = headerCase(
		await parsed.uppercase,
		'always',
		'lower-case'
	);
	expect(message).toContain('must be lower-case');
});

test('should use expected message with "never"', async () => {
	const [, message] = headerCase(await parsed.uppercase, 'never', 'upper-case');
	expect(message).toContain('must not be upper-case');
});

test('with uppercase scope should succeed for "always [uppercase, lowercase]"', async () => {
	const [actual] = headerCase(await parsed.uppercase, 'always', [
		'uppercase',
		'lowercase',
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with lowercase header should succeed for "always [uppercase, lowercase]"', async () => {
	const [actual] = headerCase(await parsed.lowercase, 'always', [
		'uppercase',
		'lowercase',
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase header should fail for "always [uppercase, lowercase]"', async () => {
	const [actual] = headerCase(await parsed.mixedcase, 'always', [
		'uppercase',
		'lowercase',
	]);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase header should pass for "always [uppercase, lowercase, camel-case]"', async () => {
	const [actual] = headerCase(await parsed.mixedcase, 'always', [
		'uppercase',
		'lowercase',
		'camel-case',
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should pass for "never [uppercase, lowercase]"', async () => {
	const [actual] = headerCase(await parsed.mixedcase, 'never', [
		'uppercase',
		'lowercase',
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with uppercase scope should fail for "never [uppercase, lowercase]"', async () => {
	const [actual] = headerCase(await parsed.uppercase, 'never', [
		'uppercase',
		'lowercase',
	]);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with numeric header should succeed for "never lowercase"', async () => {
	const [actual] = headerCase(await parsed.numeric, 'never', 'lowercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with numeric header should succeed for "always lowercase"', async () => {
	const [actual] = headerCase(await parsed.numeric, 'always', 'lowercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with numeric header should succeed for "never uppercase"', async () => {
	const [actual] = headerCase(await parsed.numeric, 'never', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with numeric header should succeed for "always uppercase"', async () => {
	const [actual] = headerCase(await parsed.numeric, 'always', 'uppercase');
	const expected = true;
	expect(actual).toEqual(expected);
});
