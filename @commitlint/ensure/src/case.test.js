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
	const actual = ensure('*', 'pascal-case');
	t.is(actual, true);
});

test('true for * on start-case', t => {
	const actual = ensure('*', 'start-case');
	t.is(actual, true);
});

test('true for `Any_CASE_iN_back-quotes` on lowercase', t => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'lowercase');
	t.is(actual, true);
});

test('true for `Any_CASE_iN_back-quotes` on uppercase', t => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'uppercase');
	t.is(actual, true);
});

test('true for `Any_CASE_iN_back-quotes` on sentence-case', t => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'sentence-case');
	t.is(actual, true);
});

test('true for `Any_CASE_iN_back-quotes` on camel-case', t => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'camel-case');
	t.is(actual, true);
});

test('true for `Any_CASE_iN_back-quotes` on kebab-case', t => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'kebab-case');
	t.is(actual, true);
});

test('true for `Any_CASE_iN_back-quotes` on snake-case', t => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'snake-case');
	t.is(actual, true);
});

test('true for `Any_CASE_iN_back-quotes` on pascal-case', t => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'pascal-case');
	t.is(actual, true);
});

test('true for `Any_CASE_iN_back-quotes` on start-case', t => {
	const actual = ensure('`Any_CASE_iN_back-quotes`', 'start-case');
	t.is(actual, true);
});

test('true for lowercase `Any_CASE_iN_back-quotes` lowercase on lowercase', t => {
	const actual = ensure(
		'lowercase `Any_CASE_iN_back-quotes` lowercase',
		'lowercase'
	);
	t.is(actual, true);
});

test('false for UPPERCASE `Any_CASE_iN_back-quotes` UPPERCASE on lowercase', t => {
	const actual = ensure(
		'UPPERCASE `Any_CASE_iN_back-quotes` UPPERCASE',
		'lowercase'
	);
	t.is(actual, false);
});

test('true for UPPERCASE `Any_CASE_iN_back-quotes` UPPERCASE on uppercase', t => {
	const actual = ensure(
		'UPPERCASE `Any_CASE_iN_back-quotes` UPPERCASE',
		'uppercase'
	);
	t.is(actual, true);
});

test('false for lowercase `Any_CASE_iN_back-quotes` lowercase on uppercase', t => {
	const actual = ensure(
		'lowercase `Any_CASE_iN_back-quotes` lowercase',
		'uppercase'
	);
	t.is(actual, false);
});

test('true for fooBar`Any_CASE_iN_back-quotes`fooBar on camel-case', t => {
	const actual = ensure('fooBar`Any_CASE_iN_back-quotes`fooBar', 'camel-case');
	t.is(actual, true);
});

test('false for Foo Bar`Any_CASE_iN_back-quotes` Foo Bar on camel-case', t => {
	const actual = ensure(
		'Foo Bar`Any_CASE_iN_back-quotes` Foo Bar',
		'camel-case'
	);
	t.is(actual, false);
});

test('true for foo-bar`Any_CASE_iN_back-quotes`foo-bar on kebab-case', t => {
	const actual = ensure(
		'foo-bar`Any_CASE_iN_back-quotes`foo-bar',
		'kebab-case'
	);
	t.is(actual, true);
});

test('false for Foo Bar `Any_CASE_iN_back-quotes` Foo Bar on kebab-case', t => {
	const actual = ensure(
		'Foo Bar `Any_CASE_iN_back-quotes` Foo Bar',
		'kebab-case'
	);
	t.is(actual, false);
});

test('true for foo_bar`Any_CASE_iN_back-quotes`foo_bar on snake-case', t => {
	const actual = ensure(
		'foo_bar`Any_CASE_iN_back-quotes`foo_bar',
		'snake-case'
	);
	t.is(actual, true);
});

test('false for Foo Bar `Any_CASE_iN_back-quotes` Foo Bar on snake-case', t => {
	const actual = ensure(
		'Foo Bar `Any_CASE_iN_back-quotes` Foo Bar',
		'snake-case'
	);
	t.is(actual, false);
});

test('true for PascalCase`Any_CASE_iN_back-quotes`PascalCase on pascal-case', t => {
	const actual = ensure(
		'PascalCase`Any_CASE_iN_back-quotes`PascalCase',
		'pascal-case'
	);
	t.is(actual, true);
});

test('false for Foo Bar `Any_CASE_iN_back-quotes` Foo Bar on pascal-case', t => {
	const actual = ensure(
		'Foo Bar `Any_CASE_iN_back-quotes` Foo Bar',
		'pascal-case'
	);
	t.is(actual, false);
});

test('true for Foo Bar`Any_CASE_iN_back-quotes` Foo Bar on start-case', t => {
	const actual = ensure(
		'Foo Bar `Any_CASE_iN_back-quotes`Foo Bar',
		'start-case'
	);
	t.is(actual, true);
});

test('false for foo_bar`Any_CASE_iN_back-quotes`foo_bar on start-case', t => {
	const actual = ensure(
		'foo_bar`Any_CASE_iN_back-quotes`foo_bar',
		'start-case'
	);
	t.is(actual, false);
});

test('true for lowercase `Any_CASE_iN_back-quotes` `Any_CASE_iN_back-quotes` lowercase on lowercase', t => {
	const actual = ensure(
		'lowercase `Any_CASE_iN_back-quotes` `Any_CASE_iN_back-quotes` lowercase',
		'lowercase'
	);
	t.is(actual, true);
});

test("true for 'Any_CASE_iN_single-quotes' on lowercase", t => {
	const actual = ensure("'Any_CASE_iN_single-quotes'", 'lowercase');
	t.is(actual, true);
});

test('true for "Any_CASE_iN_double-quotes" on lowercase', t => {
	const actual = ensure('"Any_CASE_iN_double-quotes"', 'lowercase');
	t.is(actual, true);
});

test('true for `lowercasel"\'` on lowercase', t => {
	const actual = ensure('`lowercasel"\'`', 'lowercase');
	t.is(actual, true);
});

test('false for `LOWERCASE on lowercase', t => {
	const actual = ensure('`LOWERCASE', 'lowercase');
	t.is(actual, false);
});

test('true for numeric on camel-case', t => {
	t.true(ensure('1.0.0', 'camel-case'));
});

test('true for numeric on kebab-case', t => {
	t.true(ensure('1.0.0', 'kebab-case'));
});

test('true for numeric on snake-case', t => {
	t.true(ensure('1.0.0', 'snake-case'));
});

test('true for numeric on pascal-case', t => {
	t.true(ensure('1.0.0', 'pascal-case'));
});

test('true for numeric on uppercase', t => {
	t.true(ensure('1.0.0', 'uppercase'));
});

test('true for numeric on sentencecase', t => {
	t.true(ensure('1.0.0', 'sentencecase'));
});

test('true for numeric on lowercase', t => {
	t.true(ensure('1.0.0', 'lowercase'));
});
