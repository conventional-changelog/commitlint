import {RuleConfigSeverity} from '@commitlint/types';

import getForcedCaseFn from './get-forced-case-fn';

test('should not apply', () => {
	let rule = getForcedCaseFn(['name', [RuleConfigSeverity.Disabled]]);
	expect(rule('test')).toBe('test');
	expect(rule('test-foo')).toBe('test-foo');
	expect(rule('testFoo')).toBe('testFoo');
	expect(rule('TEST_FOO')).toBe('TEST_FOO');

	rule = getForcedCaseFn();
	expect(rule('test')).toBe('test');
	expect(rule('test-foo')).toBe('test-foo');
	expect(rule('testFoo')).toBe('testFoo');
	expect(rule('TEST_FOO')).toBe('TEST_FOO');

	rule = getForcedCaseFn(['name', [RuleConfigSeverity.Warning, 'never']]);
	expect(rule('test')).toBe('test');
	expect(rule('test-foo')).toBe('test-foo');
	expect(rule('testFoo')).toBe('testFoo');
	expect(rule('TEST_FOO')).toBe('TEST_FOO');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', ['camel-case', 'lowercase']],
	]);
	expect(rule('test')).toBe('test');
	expect(rule('test-foo')).toBe('test-foo');
	expect(rule('testFoo')).toBe('testFoo');
	expect(rule('TEST_FOO')).toBe('TEST_FOO');
});

test('should throw error on invalid casing', () => {
	expect(() =>
		getForcedCaseFn(['name', [RuleConfigSeverity.Warning, 'always']])
	).toThrow('Unknown target case "undefined"');

	expect(() =>
		getForcedCaseFn(['name', [RuleConfigSeverity.Warning, 'always', 'foo']])
	).toThrow('Unknown target case "foo"');
});

test('should convert text correctly', () => {
	let rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'camel-case'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('testFooBarBazBaz');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'kebab-case'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('test-foo-bar-baz-baz');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'snake-case'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('test_foo_bar_baz_baz');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'pascal-case'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('TestFooBarBazBaz');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'start-case'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('TEST FOO Bar Baz Baz');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'upper-case'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('TEST_FOOBAR-BAZ BAZ');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'uppercase'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('TEST_FOOBAR-BAZ BAZ');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'sentence-case'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('Test_foobar-baz baz');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'sentencecase'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('Test_foobar-baz baz');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'lower-case'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('test_foobar-baz baz');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'lowercase'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('test_foobar-baz baz');

	rule = getForcedCaseFn([
		'name',
		[RuleConfigSeverity.Warning, 'always', 'lowerCase'],
	]);
	expect(rule('TEST_FOOBar-baz baz')).toBe('test_foobar-baz baz');
});
