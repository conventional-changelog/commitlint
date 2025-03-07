import {test, expect} from 'vitest';

import ensure from './case.js';

test('true for no params', () => {
	const actual = ensure();
	expect(actual).toBe(true);
});

test('true for empty', () => {
	const actual = ensure('');
	expect(actual).toBe(true);
});

test('true for lowercase', () => {
	const actual = ensure('a');
	expect(actual).toBe(true);
});

test('false for uppercase', () => {
	const actual = ensure('A');
	expect(actual).toBe(false);
});

test('true for lowercase on lowercase', () => {
	const actual = ensure('a', 'lowercase');
	expect(actual).toBe(true);
});

test('false for uppercase on lowercase', () => {
	const actual = ensure('A', 'lowercase');
	expect(actual).toBe(false);
});

test('true for * on lowercase', () => {
	const actual = ensure('*', 'lowercase');
	expect(actual).toBe(true);
});

test('true for uppercase on uppercase', () => {
	const actual = ensure('A', 'uppercase');
	expect(actual).toBe(true);
});

test('false for lowercase on uppercase', () => {
	const actual = ensure('a', 'uppercase');
	expect(actual).toBe(false);
});

test('true for * on uppercase', () => {
	const actual = ensure('*', 'uppercase');
	expect(actual).toBe(true);
});

test('true for sentencecase on sentencecase', () => {
	const actual = ensure('Sentence case', 'sentence-case');
	expect(actual).toBe(true);
});

test('false for lowercase on sentencecase', () => {
	const actual = ensure('sentence case', 'sentence-case');
	expect(actual).toBe(false);
});

test('true for UPPERCASE on sentencecase', () => {
	const actual = ensure('UPPERCASE', 'sentence-case');
	expect(actual).toBe(true);
});

test('true for Start Case on sentencecase', () => {
	const actual = ensure('Start Case', 'sentence-case');
	expect(actual).toBe(true);
});

test('true for PascalCase on sentencecase', () => {
	const actual = ensure('PascalCase', 'sentence-case');
	expect(actual).toBe(true);
});

test('false for kebab-case on sentencecase', () => {
	const actual = ensure('kebab-case', 'sentence-case');
	expect(actual).toBe(false);
});

test('false for snake_case on sentencecase', () => {
	const actual = ensure('snake_case', 'sentence-case');
	expect(actual).toBe(false);
});

test('false for camelCase on sentencecase', () => {
	const actual = ensure('camelCase', 'sentence-case');
	expect(actual).toBe(false);
});

test('true for * on sentence-case', () => {
	const actual = ensure('*', 'sentence-case');
	expect(actual).toBe(true);
});

test('true for * on camel-case', () => {
	const actual = ensure('*', 'camel-case');
	expect(actual).toBe(true);
});

test('true for * on kebab-case', () => {
	const actual = ensure('*', 'kebab-case');
	expect(actual).toBe(true);
});

test('true for * on snake-case', () => {
	const actual = ensure('*', 'snake-case');
	expect(actual).toBe(true);
});

test('true for * on pascal-case', () => {
	const actual = ensure('*', 'pascal-case');
	expect(actual).toBe(true);
});

test('true for * on start-case', () => {
	const actual = ensure('*', 'start-case');
	expect(actual).toBe(true);
});

test('true for `Any_CASE_iN_back-quotes` on lowercase', () => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'lowercase');
	expect(actual).toBe(true);
});

test('true for `Any_CASE_iN_back-quotes` on uppercase', () => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'uppercase');
	expect(actual).toBe(true);
});

test('true for `Any_CASE_iN_back-quotes` on sentence-case', () => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'sentence-case');
	expect(actual).toBe(true);
});

test('true for `Any_CASE_iN_back-quotes` on camel-case', () => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'camel-case');
	expect(actual).toBe(true);
});

test('true for `Any_CASE_iN_back-quotes` on kebab-case', () => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'kebab-case');
	expect(actual).toBe(true);
});

test('true for `Any_CASE_iN_back-quotes` on snake-case', () => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'snake-case');
	expect(actual).toBe(true);
});

test('true for `Any_CASE_iN_back-quotes` on pascal-case', () => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'pascal-case');
	expect(actual).toBe(true);
});

test('true for `Any_CASE_iN_back-quotes` on start-case', () => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'start-case');
	expect(actual).toBe(true);
});

test('true for lowercase `Any_CASE_iN_back-quotes` lowercase on lowercase', () => {
	const actual = ensure(
		'lowercase `Any_CASE_iN_back-quotes` lowercase',
		'lowercase',
	);
	expect(actual).toBe(true);
});

test('false for UPPERCASE `Any_CASE_iN_back-quotes` UPPERCASE on lowercase', () => {
	const actual = ensure(
		'UPPERCASE `Any_CASE_iN_back-quotes` UPPERCASE',
		'lowercase',
	);
	expect(actual).toBe(false);
});

test('true for UPPERCASE `Any_CASE_iN_back-quotes` UPPERCASE on uppercase', () => {
	const actual = ensure(
		'UPPERCASE `Any_CASE_iN_back-quotes` UPPERCASE',
		'uppercase',
	);
	expect(actual).toBe(true);
});

test('false for lowercase `Any_CASE_iN_back-quotes` lowercase on uppercase', () => {
	const actual = ensure(
		'lowercase `Any_CASE_iN_back-quotes` lowercase',
		'uppercase',
	);
	expect(actual).toBe(false);
});

test('true for fooBar`Any_CASE_iN_back-quotes`fooBar on camel-case', () => {
	const actual = ensure('fooBar`Any_CASE_iN_back-quotes`fooBar', 'camel-case');
	expect(actual).toBe(true);
});

test('false for Foo Bar`Any_CASE_iN_back-quotes` Foo Bar on camel-case', () => {
	const actual = ensure(
		'Foo Bar`Any_CASE_iN_back-quotes` Foo Bar',
		'camel-case',
	);
	expect(actual).toBe(false);
});

test('true for foo-bar`Any_CASE_iN_back-quotes`foo-bar on kebab-case', () => {
	const actual = ensure(
		'foo-bar`Any_CASE_iN_back-quotes`foo-bar',
		'kebab-case',
	);
	expect(actual).toBe(true);
});

test('false for Foo Bar `Any_CASE_iN_back-quotes` Foo Bar on kebab-case', () => {
	const actual = ensure(
		'Foo Bar `Any_CASE_iN_back-quotes` Foo Bar',
		'kebab-case',
	);
	expect(actual).toBe(false);
});

test('true for foo_bar`Any_CASE_iN_back-quotes`foo_bar on snake-case', () => {
	const actual = ensure(
		'foo_bar`Any_CASE_iN_back-quotes`foo_bar',
		'snake-case',
	);
	expect(actual).toBe(true);
});

test('false for Foo Bar `Any_CASE_iN_back-quotes` Foo Bar on snake-case', () => {
	const actual = ensure(
		'Foo Bar `Any_CASE_iN_back-quotes` Foo Bar',
		'snake-case',
	);
	expect(actual).toBe(false);
});

test('true for PascalCase`Any_CASE_iN_back-quotes`PascalCase on pascal-case', () => {
	const actual = ensure(
		'PascalCase`Any_CASE_iN_back-quotes`PascalCase',
		'pascal-case',
	);
	expect(actual).toBe(true);
});

test('false for Foo Bar `Any_CASE_iN_back-quotes` Foo Bar on pascal-case', () => {
	const actual = ensure(
		'Foo Bar `Any_CASE_iN_back-quotes` Foo Bar',
		'pascal-case',
	);
	expect(actual).toBe(false);
});

test('true for Foo Bar`Any_CASE_iN_back-quotes` Foo Bar on start-case', () => {
	const actual = ensure(
		'Foo Bar `Any_CASE_iN_back-quotes`Foo Bar',
		'start-case',
	);
	expect(actual).toBe(true);
});

test('false for foo_bar`Any_CASE_iN_back-quotes`foo_bar on start-case', () => {
	const actual = ensure(
		'foo_bar`Any_CASE_iN_back-quotes`foo_bar',
		'start-case',
	);
	expect(actual).toBe(false);
});

test('true for lowercase `Any_CASE_iN_back-quotes` `Any_CASE_iN_back-quotes` lowercase on lowercase', () => {
	const actual = ensure(
		'lowercase `Any_CASE_iN_back-quotes` `Any_CASE_iN_back-quotes` lowercase',
		'lowercase',
	);
	expect(actual).toBe(true);
});

test("true for 'Any_CASE_iN_single-quotes' on lowercase", () => {
	const actual = ensure("'Any_CASE_iN_single-quotes'", 'lowercase');
	expect(actual).toBe(true);
});

test('true for "Any_CASE_iN_double-quotes" on lowercase', () => {
	const actual = ensure('"Any_CASE_iN_double-quotes"', 'lowercase');
	expect(actual).toBe(true);
});

test('true for `lowercasel"\'` on lowercase', () => {
	const actual = ensure('`lowercasel"\'`', 'lowercase');
	expect(actual).toBe(true);
});

test('false for `LOWERCASE on lowercase', () => {
	const actual = ensure('`LOWERCASE', 'lowercase');
	expect(actual).toBe(false);
});

test('true for numeric on camel-case', () => {
	const actual = ensure('1.0.0', 'camel-case');
	expect(actual).toBe(true);
});

test('true for numeric on kebab-case', () => {
	const actual = ensure('1.0.0', 'kebab-case');
	expect(actual).toBe(true);
});

test('true for numeric on snake-case', () => {
	const actual = ensure('1.0.0', 'snake-case');
	expect(actual).toBe(true);
});

test('true for numeric on pascal-case', () => {
	const actual = ensure('1.0.0', 'pascal-case');
	expect(actual).toBe(true);
});

test('true for numeric on uppercase', () => {
	const actual = ensure('1.0.0', 'uppercase');
	expect(actual).toBe(true);
});

test('true for numeric on sentencecase', () => {
	const actual = ensure('1.0.0', 'sentencecase');
	expect(actual).toBe(true);
});

test('true for numeric on lowercase', () => {
	const actual = ensure('1.0.0', 'lowercase');
	expect(actual).toBe(true);
});

test('throw TypeError for invalid case name', () => {
	const actualFn = () => ensure('anything', 'someweirdcase' as any);
	expect(actualFn).toThrow(TypeError);
});
