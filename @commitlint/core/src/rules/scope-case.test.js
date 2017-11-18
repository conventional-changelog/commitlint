import test from 'ava';
import parse from '../library/parse';
import scopeCase from './scope-case';

const messages = {
	empty: 'chore: subject',
	lowercase: 'chore(scope): subject',
	mixedcase: 'chore(sCoPe): subject',
	uppercase: 'chore(SCOPE): subject',
	camelcase: 'chore(myScope): subject',
	kebabcase: 'chore(my-scope): subject',
	pascalcase: 'chore(MyScope): subject',
	snakecase: 'chore(my_scope): subject',
	startcase: 'chore(My Scope): subject'
};

const parsed = {
	empty: parse(messages.empty),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase),
	camelcase: parse(messages.camelcase),
	kebabcase: parse(messages.kebabcase),
	pascalcase: parse(messages.pascalcase),
	snakecase: parse(messages.snakecase),
	startcase: parse(messages.startcase)
};

test('with empty scope should succeed for "never lowercase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "always lowercase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "never uppercase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "always uppercase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "never camelcase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'camel-case');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "always camelcase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'camel-case');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "never kebabcase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'kebab-case');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "always kebabcase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'kebab-case');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "never pascalcase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'pascal-case');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "always pascalcase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'pascal-case');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "never snakecase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'snake-case');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "always snakecase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'snake-case');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "never startcase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'start-case');
	const expected = true;
	t.is(actual, expected);
});

test('with empty scope should succeed for "always startcase"', async t => {
	const [actual] = scopeCase(await parsed.empty, 'never', 'start-case');
	const expected = true;
	t.is(actual, expected);
});

test('with lowercase scope should fail for "never lowercase"', async t => {
	const [actual] = scopeCase(await parsed.lowercase, 'never', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase scope should succeed for "always lowercase"', async t => {
	const [actual] = scopeCase(await parsed.lowercase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase scope should succeed for "never lowercase"', async t => {
	const [actual] = scopeCase(await parsed.mixedcase, 'never', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase scope should fail for "always lowercase"', async t => {
	const [actual] = scopeCase(await parsed.mixedcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with mixedcase scope should succeed for "never uppercase"', async t => {
	const [actual] = scopeCase(await parsed.mixedcase, 'never', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});

test('with kebabcase scope should succeed for "always lowercase"', async t => {
	const [actual] = scopeCase(await parsed.kebabcase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with kebabcase scope should fail for "always camelcase"', async t => {
	const [actual] = scopeCase(await parsed.kebabcase, 'always', 'camel-case');
	const expected = false;
	t.is(actual, expected);
});

test('with kebabcase scope should fail for "always pascalcase"', async t => {
	const [actual] = scopeCase(await parsed.kebabcase, 'always', 'pascal-case');
	const expected = false;
	t.is(actual, expected);
});

test('with kebabcase scope should succeed for "always kebabcase"', async t => {
	const [actual] = scopeCase(await parsed.kebabcase, 'always', 'kebab-case');
	const expected = true;
	t.is(actual, expected);
});

test('with snakecase scope should succeed for "always lowercase"', async t => {
	const [actual] = scopeCase(await parsed.snakecase, 'always', 'lowercase');
	const expected = true;
	t.is(actual, expected);
});

test('with snakecase scope should fail for "always camelcase"', async t => {
	const [actual] = scopeCase(await parsed.snakecase, 'always', 'camel-case');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase scope should fail for "always pascalcase"', async t => {
	const [actual] = scopeCase(await parsed.snakecase, 'always', 'pascal-case');
	const expected = false;
	t.is(actual, expected);
});

test('with snakecase scope should succeed for "always snakecase"', async t => {
	const [actual] = scopeCase(await parsed.snakecase, 'always', 'snake-case');
	const expected = true;
	t.is(actual, expected);
});

test('with camelcase scope should fail for "always lowercase"', async t => {
	const [actual] = scopeCase(await parsed.camelcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase scope should succeed for "always camelcase"', async t => {
	const [actual] = scopeCase(await parsed.camelcase, 'always', 'camel-case');
	const expected = true;
	t.is(actual, expected);
});

test('with camelcase scope should fail for "always kebabcase"', async t => {
	const [actual] = scopeCase(await parsed.camelcase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with camelcase scope should fail for "always pascalcase"', async t => {
	const [actual] = scopeCase(await parsed.camelcase, 'always', 'pascal-case');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase scope should fail for "always lowercase"', async t => {
	const [actual] = scopeCase(await parsed.pascalcase, 'always', 'lowercase');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase scope should fail for "always kebabcase"', async t => {
	const [actual] = scopeCase(await parsed.pascalcase, 'always', 'kebab-case');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase scope should fail for "always camelcase"', async t => {
	const [actual] = scopeCase(await parsed.pascalcase, 'always', 'camel-case');
	const expected = false;
	t.is(actual, expected);
});

test('with pascalcase scope should succeed for "always pascalcase"', async t => {
	const [actual] = scopeCase(await parsed.pascalcase, 'always', 'pascal-case');
	const expected = true;
	t.is(actual, expected);
});

test('with mixedcase scope should fail for "always uppercase"', async t => {
	const [actual] = scopeCase(await parsed.mixedcase, 'always', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with uppercase scope should fail for "never uppercase"', async t => {
	const [actual] = scopeCase(await parsed.uppercase, 'never', 'uppercase');
	const expected = false;
	t.is(actual, expected);
});

test('with lowercase scope should succeed for "always uppercase"', async t => {
	const [actual] = scopeCase(await parsed.uppercase, 'always', 'uppercase');
	const expected = true;
	t.is(actual, expected);
});
