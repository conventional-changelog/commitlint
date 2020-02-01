import config from '.';
import rules from '@commitlint/rules';
import parse from '@commitlint/parse';

const messages = Object.entries({
	simple: 'test: subject',
	empty: 'test: subject\nbody',
	filled: 'test: subject\nBREAKING CHANGE: something important'
});
const configRules = Object.entries(config.rules);

it('should have correct structure', () => {
	expect(config).toMatchObject({
		rules: expect.any(Object)
	});
});

describe('rules', () => {
	describe.each(configRules)('%s', (name, options) => {
		const severity = options.unshift();
		it.each(messages)('%s', async (type, message) => {
			expect(
				rules[name](await parse(message), severity, options)
			).toMatchSnapshot();
		});
	});
});
