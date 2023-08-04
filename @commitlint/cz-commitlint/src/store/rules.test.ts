import {QualifiedRules} from '@commitlint/types';
import {GetRuleMethod, SetRulesMethod} from './rules';

let getRule: GetRuleMethod;
let setRules: SetRulesMethod;
beforeEach(() => {
	jest.resetModules();
	getRule = require('./rules').getRule;
	setRules = require('./rules').setRules;
});
describe('getRule', () => {
	test('should get rule when prefix and property strict match', () => {
		const rules: QualifiedRules = {
			'body-max-length': [2, 'always', 100],
			'footer-max-line-length': [2, 'always', 100],
			'subject-empty': [2, 'never'],
		};
		setRules(rules);

		expect(getRule('body', 'max-length')).toBe(rules['body-max-length']);
		expect(getRule('footer', 'max-line-length')).toBe(
			rules['footer-max-line-length'],
		);
		expect(getRule('subject', 'empty')).toBe(rules['subject-empty']);
	});

	test('should not get rule when prefix is invalid', () => {
		const rules: QualifiedRules = {
			'body-max-length': [2, 'always', 100],
		};
		setRules(rules);

		expect(getRule('body-max', 'length')).toBeUndefined();
		expect(getRule('body-max', 'max-length')).toBeUndefined();
		expect(getRule('', 'body-max-length')).toBeUndefined();
	});

	test('should not get rule when property is partial match', () => {
		const rules: QualifiedRules = {
			'body-max-length': [2, 'always', 100],
			'body-leading-blank': [1, 'always'],
		};
		setRules(rules);

		expect(getRule('body', 'length')).toBeUndefined();
		expect(getRule('body', 'line-leading-blank')).toBeUndefined();
	});
});

describe('setRule', () => {
	test('should overwrite all rules when setRule', () => {
		expect(getRule('body', 'max-length')).toBeUndefined();

		let rules: QualifiedRules = {
			'body-max-length': [2, 'always', 100],
		};
		setRules(rules);
		expect(getRule('body', 'max-length')).toBe(rules['body-max-length']);

		rules = {
			'footer-max-length': [2, 'always', 100],
		};
		setRules(rules);
		expect(getRule('body', 'max-length')).toBeUndefined();
		expect(getRule('footer', 'max-length')).toBe(rules['footer-max-length']);
	});
});
