import test from 'ava';
import parse from '../library/parse';
import typeCase from './type-case';

const messages = {
	empty: '(scope): subject',
	lowercase: 'type: subject',
	mixedcase: 'tYpE: subject',
	uppercase: 'TYPE: subject',
	camelcase: 'tyPe: subject',
	pascalcase: 'TyPe: subject',
	snakecase: 'ty_pe: subject',
	kebabcase: 'ty-pe: subject',
	startcase: 'Ty Pe: subject'
};

const parsed = {
	empty: parse(messages.empty),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase),
	camelcase: parse(messages.camelcase),
	pascalcase: parse(messages.pascalcase),
	snakecase: parse(messages.snakecase),
	kebabcase: parse(messages.kebabcase),
	startcase: parse(messages.startcase)
};

test('with empty type should succeed for "never lowercase"', async t => {
	const [actual] = typeCase(await parsed.empty, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty type should succeed for "always lowercase"', async t => {
	const [actual] = typeCase(await parsed.empty, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty type should succeed for "never uppercase"', async t => {
	const [actual] = typeCase(await parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty type should succeed for "always uppercase"', async t => {
	const [actual] = typeCase(await parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with lowercase type should fail for "never lowercase"', async t => {
	const [actual] = typeCase(await parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase type should succeed for "always lowercase"', async t => {
	const [actual] = typeCase(await parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase type should succeed for "never lowercase"', async t => {
	const [actual] = typeCase(await parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase type should fail for "always lowercase"', async t => {
	const [actual] = typeCase(await parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with mixedcase type should succeed for "never uppercase"', async t => {
	const [actual] = typeCase(await parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase type should fail for "always uppercase"', async t => {
	const [actual] = typeCase(await parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with uppercase type should fail for "never uppercase"', async t => {
	const [actual] = typeCase(await parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase type should succeed for "always uppercase"', async t => {
	const [actual] = typeCase(await parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with camelcase type should fail for "always uppercase"', async t => {
	const [actual] = typeCase(await parsed.camelcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase type should succeed for "never uppercase"', async t => {
	const [actual] = typeCase(await parsed.camelcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with camelcase type should fail for "always pascalcase"', async t => {
	const [actual] = typeCase(await parsed.camelcase, 'always', 'pascal-case');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase type should fail for "always kebabcase"', async t => {
	const [actual] = typeCase(await parsed.camelcase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase type should fail for "always snakecase"', async t => {
	const [actual] = typeCase(await parsed.camelcase, 'always', 'snake-case');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase type should fail for "always startcase"', async t => {
	const [actual] = typeCase(await parsed.camelcase, 'always', 'start-case');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase type should succeed for "always camelcase"', async t => {
	const [actual] = typeCase(await parsed.camelcase, 'always', 'camel-case');
	const expected = true;
	t.is(actual, expected);
});

test('with pascalcase type should fail for "always uppercase"', async t => {
	const [actual] = typeCase(await parsed.pascalcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase type should succeed for "never uppercase"', async t => {
	const [actual] = typeCase(await parsed.pascalcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with pascalcase type should fail for "always camelcase"', async t => {
	const [actual] = typeCase(await parsed.pascalcase, 'always', 'camel-case');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase type should fail for "always kebabcase"', async t => {
	const [actual] = typeCase(await parsed.pascalcase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase type should fail for "always snakecase"', async t => {
	const [actual] = typeCase(await parsed.pascalcase, 'always', 'snake-case');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase type should fail for "always startcase"', async t => {
	const [actual] = typeCase(await parsed.pascalcase, 'always', 'start-case');
	const expected = true;
	t.is(actual, expected);
});

test('with pascalcase type should succeed for "always pascalcase"', async t => {
	const [actual] = typeCase(await parsed.pascalcase, 'always', 'pascal-case');
	const expected = true;
	t.is(actual, expected);
});

test('with snakecase type should fail for "always uppercase"', async t => {
	const [actual] = typeCase(await parsed.snakecase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase type should succeed for "never uppercase"', async t => {
	const [actual] = typeCase(await parsed.snakecase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with snakecase type should fail for "always camelcase"', async t => {
	const [actual] = typeCase(await parsed.snakecase, 'always', 'camel-case');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase type should fail for "always kebabcase"', async t => {
	const [actual] = typeCase(await parsed.snakecase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase type should succeed for "always snakecase"', async t => {
	const [actual] = typeCase(await parsed.snakecase, 'always', 'snake-case');
	const expected = true;
	t.is(actual, expected);
});

test('with snakecase type should fail for "always pascalcase"', async t => {
	const [actual] = typeCase(await parsed.snakecase, 'always', 'pascal-case');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase type should fail for "always start case"', async t => {
	const [actual] = typeCase(await parsed.snakecase, 'always', 'start-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase type should fail for "always uppercase"', async t => {
	const [actual] = typeCase(await parsed.startcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase type should succeed for "never uppercase"', async t => {
	const [actual] = typeCase(await parsed.startcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with startcase type should fail for "always camelcase"', async t => {
	const [actual] = typeCase(await parsed.startcase, 'always', 'camel-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase type should fail for "always kebabcase"', async t => {
	const [actual] = typeCase(await parsed.startcase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase type should fail for "always snakecase"', async t => {
	const [actual] = typeCase(await parsed.startcase, 'always', 'snake-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase type should fail for "always pascalcase"', async t => {
	const [actual] = typeCase(await parsed.startcase, 'always', 'pascal-case');
	const expected = false;
	t.is(actual, expected);
});

test('with startcase type should succeed for "always startcase"', async t => {
	const [actual] = typeCase(await parsed.startcase, 'always', 'start-case');
	const expected = true;
	t.is(actual, expected);
});
