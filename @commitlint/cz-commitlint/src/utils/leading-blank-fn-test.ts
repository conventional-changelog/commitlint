import {RuleConfigSeverity} from '@commitlint/types';

import getLeadingBlankFn from './leading-blank-fn.js';

test('should not apply', () => {
	let rule = getLeadingBlankFn([RuleConfigSeverity.Disabled]);
	expect(rule('test')).toBe('test');
	expect(rule('\ntest')).toBe('\ntest');
	expect(rule('aaa\ntest')).toBe('aaa\ntest');
	expect(rule('')).toBe('');

	rule = getLeadingBlankFn();
	expect(rule('test')).toBe('test');
	expect(rule('\ntest')).toBe('\ntest');
	expect(rule('aaa\ntest')).toBe('aaa\ntest');
	expect(rule('')).toBe('');
});

test('should add leading blank', () => {
	const rule = getLeadingBlankFn([RuleConfigSeverity.Error, 'always']);
	expect(rule('test')).toBe('\ntest');
	expect(rule('\ntest')).toBe('\ntest');
	expect(rule('\n\ntest')).toBe('\n\ntest');
	expect(rule('aaa\ntest')).toBe('\naaa\ntest');
	expect(rule('\naaa\ntest')).toBe('\naaa\ntest');
	expect(rule('')).toBe('\n');
});

test('should remove leading blank', () => {
	const rule = getLeadingBlankFn([RuleConfigSeverity.Error, 'never']);
	expect(rule('test')).toBe('test');
	expect(rule('\ntest')).toBe('test');
	expect(rule('\n\ntest')).toBe('test');
	expect(rule('aaa\ntest')).toBe('aaa\ntest');
	expect(rule('\naaa\ntest')).toBe('aaa\ntest');
	expect(rule('\n\n\naaa\ntest')).toBe('aaa\ntest');
	expect(rule('')).toBe('');
});
