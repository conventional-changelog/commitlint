import test from 'ava';
import ensure from './case';

test('true for no params', t => {
	const actual = ensure();
	t.is(actual, true);
});

test('true for empty', t => {
	const actual = ensure('');
	t.is(actual, true);
});

test('true for lowercase', t => {
	const actual = ensure('a');
	t.is(actual, true);
});

test('false for uppercase', t => {
	const actual = ensure('A');
	t.is(actual, false);
});

test('true for lowercase on lowercase', t => {
	const actual = ensure('a', 'lowercase');
	t.is(actual, true);
});

test('false for uppercase on lowercase', t => {
	const actual = ensure('A', 'lowercase');
	t.is(actual, false);
});

test('true for * on lowercase', t => {
	const actual = ensure('*', 'lowercase');
	console.log({actual});
	t.is(actual, true);
});

test('true for uppercase on uppercase', t => {
	const actual = ensure('A', 'uppercase');
	t.is(actual, true);
});

test('false for lowercase on uppercase', t => {
	const actual = ensure('a', 'uppercase');
	t.is(actual, false);
});

test('true for * on uppercase', t => {
	const actual = ensure('*', 'uppercase');
	t.is(actual, true);
});

test('true for sentencecase on sentencecase', t => {
	const actual = ensure('Sentence case', 'sentence-case');
	t.is(actual, true);
});

test('false for lowercase on sentencecase', t => {
	t.is(ensure('sentence case', 'sentence-case'), false);
});

test('false for UPPERCASE on sentencecase', t => {
	t.is(ensure('UPPERCASE', 'sentence-case'), false);
});

test('true for Start Case on sentencecase', t => {
	t.is(ensure('Start Case', 'sentence-case'), true);
});

test('false for PascalCase on sentencecase', t => {
	t.is(ensure('PascalCase', 'sentence-case'), false);
});

test('false for kebab-case on sentencecase', t => {
	t.is(ensure('kebab-case', 'sentence-case'), false);
});

test('false for snake_case on sentencecase', t => {
	t.is(ensure('snake_case', 'sentence-case'), false);
});

test('false for camelCase on sentencecase', t => {
	t.is(ensure('camelCase', 'sentence-case'), false);
});

test('true for * on sentence-case', t => {
	const actual = ensure('*', 'sentence-case');
	t.is(actual, true);
});

test('true for * on camel-case', t => {
	const actual = ensure('*', 'camel-case');
	t.is(actual, true);
});

test('true for * on kebab-case', t => {
	const actual = ensure('*', 'kebab-case');
	t.is(actual, true);
});

test('true for * on snake-case', t => {
	const actual = ensure('*', 'snake-case');
	t.is(actual, true);
});

test('true for * on pascal-case', t => {
	const actual = ensure('*', 'snake-case');
	t.is(actual, true);
});

test('true for * on start-case', t => {
	const actual = ensure('*', 'snake-case');
	t.is(actual, true);
});
