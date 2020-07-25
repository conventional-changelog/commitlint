import lint from './lint';

test('throws without params', async () => {
	const error = (lint as any)();
	await expect(error).rejects.toThrow('Expected a raw commit');
});

test('positive on empty message', async () => {
	expect(await lint('')).toMatchObject({
		valid: true,
		errors: [],
		warnings: [],
	});
});

test('positive on stub message and no rule', async () => {
	const actual = await lint('foo: bar');
	expect(actual.valid).toBe(true);
});

test('positive on stub message and adhered rule', async () => {
	const actual = await lint('foo: bar', {
		'type-enum': [2, 'always', ['foo']],
	});
	expect(actual.valid).toBe(true);
});

test('negative on stub message and broken rule', async () => {
	const actual = await lint('foo: bar', {
		'type-enum': [2, 'never', ['foo']],
	});
	expect(actual.valid).toBe(false);
});

test('positive on ignored message and broken rule', async () => {
	const actual = await lint('Revert "some bogus commit"', {
		'type-empty': [2, 'never'],
	});
	expect(actual.valid).toBe(true);
	expect(actual.input).toBe('Revert "some bogus commit"');
});

test('negative on ignored message, disabled ignored messages and broken rule', async () => {
	const actual = await lint(
		'Revert "some bogus commit"',
		{
			'type-empty': [2, 'never'],
		},
		{
			defaultIgnores: false,
		}
	);
	expect(actual.valid).toBe(false);
});

test('positive on custom ignored message and broken rule', async () => {
	const ignoredMessage = 'some ignored custom message';
	const actual = await lint(
		ignoredMessage,
		{
			'type-empty': [2, 'never'],
		},
		{
			ignores: [(c) => c === ignoredMessage],
		}
	);
	expect(actual.valid).toBe(true);
	expect(actual.input).toBe(ignoredMessage);
});

test('positive on stub message and opts', async () => {
	const actual = await lint(
		'foo-bar',
		{
			'type-enum': [2, 'always', ['foo']],
			'type-empty': [2, 'never'],
		},
		{
			parserOpts: {
				headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/,
			},
		}
	);
	expect(actual.valid).toBe(true);
});

test('throws for invalid rule names', async () => {
	const error = lint('foo', {foo: [2, 'always'], bar: [1, 'never']});

	await expect(error).rejects.toThrow(/^Found invalid rule names: foo, bar/);
});

test('throws for invalid rule config', async () => {
	const error = lint('type(scope): foo', {
		'type-enum': 1,
		'scope-enum': {0: 2, 1: 'never', 2: ['foo'], length: 3},
	} as any);

	await expect(error).rejects.toThrow('type-enum must be array');
	await expect(error).rejects.toThrow('scope-enum must be array');
});

test('allows disable shorthand', async () => {
	const result = lint('foo', {'type-enum': [0], 'scope-enum': [0]});

	await expect(result).resolves.toEqual({
		errors: [],
		input: 'foo',
		valid: true,
		warnings: [],
	});
});

test('throws for rule with invalid length', async () => {
	const error = lint('type(scope): foo', {'scope-enum': [1, 2, 3, 4]} as any);

	await expect(error).rejects.toThrow('scope-enum must be 2 or 3 items long');
});

test('throws for rule with invalid level', async () => {
	const error = lint('type(scope): foo', {
		'type-enum': ['2', 'always'] as any,
		'header-max-length': [{}, 'always'] as any,
	});
	await expect(error).rejects.toThrow('rule type-enum must be number');
	await expect(error).rejects.toThrow('rule header-max-length must be number');
});

test('throws for rule with out of range level', async () => {
	const error = lint('type(scope): foo', {
		'type-enum': [-1, 'always'] as any,
		'header-max-length': [3, 'always'] as any,
	});

	await expect(error).rejects.toThrow('rule type-enum must be between 0 and 2');
	await expect(error).rejects.toThrow(
		'rule header-max-length must be between 0 and 2'
	);
});

test('throws for rule with invalid condition', async () => {
	const error = lint('type(scope): foo', {
		'type-enum': [1, 2] as any,
		'header-max-length': [1, {}] as any,
	});

	await expect(error).rejects.toThrow('type-enum must be string');
	await expect(error).rejects.toThrow('header-max-length must be string');
});

test('throws for rule with out of range condition', async () => {
	const error = lint('type(scope): foo', {
		'type-enum': [1, 'foo'] as any,
		'header-max-length': [1, 'bar'] as any,
	});

	await expect(error).rejects.toThrow('type-enum must be "always" or "never"');
	await expect(error).rejects.toThrow(
		'header-max-length must be "always" or "never"'
	);
});

test('succeds for issue', async () => {
	const report = await lint('somehting #1', {
		'references-empty': [2, 'never'],
	});

	expect(report.valid).toBe(true);
});

test('fails for issue', async () => {
	const report = await lint('somehting #1', {
		'references-empty': [2, 'always'],
	});

	expect(report.valid).toBe(false);
});

test('succeds for custom issue prefix', async () => {
	const report = await lint(
		'somehting REF-1',
		{
			'references-empty': [2, 'never'],
		},
		{
			parserOpts: {
				issuePrefixes: ['REF-'],
			},
		}
	);

	expect(report.valid).toBe(true);
});

test('fails for custom issue prefix', async () => {
	const report = await lint(
		'somehting #1',
		{
			'references-empty': [2, 'never'],
		},
		{
			parserOpts: {
				issuePrefixes: ['REF-'],
			},
		}
	);

	expect(report.valid).toBe(false);
});

test('fails for custom plugin rule', async () => {
	const report = await lint(
		'somehting #1',
		{
			'plugin-rule': [2, 'never'],
		},
		{
			plugins: {
				'plugin-example': {
					rules: {
						'plugin-rule': () => [false],
					},
				},
			},
		}
	);

	expect(report.valid).toBe(false);
});

test('passes for custom plugin rule', async () => {
	const report = await lint(
		'somehting #1',
		{
			'plugin-rule': [2, 'never'],
		},
		{
			plugins: {
				'plugin-example': {
					rules: {
						'plugin-rule': () => [true],
					},
				},
			},
		}
	);

	expect(report.valid).toBe(true);
});

test('returns original message only with commit header', async () => {
	const message = 'foo: bar';
	const report = await lint(message);

	expect(report.input).toBe(message);
});

test('returns original message with commit header and body', async () => {
	const message = 'foo: bar/n/nFoo bar bizz buzz.';
	const report = await lint(message);

	expect(report.input).toBe(message);
});

test('returns original message with commit header, body and footer', async () => {
	const message = 'foo: bar/n/nFoo bar bizz buzz./n/nCloses #1';
	const report = await lint(message);

	expect(report.input).toBe(message);
});

test('returns original message with commit header, body and footer, parsing comments', async () => {
	const expected = 'foo: bar/n/nFoo bar bizz buzz./n/nCloses #1';
	const message = `${expected}\n\n# Some comment to ignore`;
	const report = await lint(
		message,
		{
			'references-empty': [2, 'never'],
		},
		{
			parserOpts: {
				commentChar: '#',
			},
		}
	);

	expect(report.input).toBe(expected);
});

test('passes for async rule', async () => {
	const report = await lint(
		'somehting #1',
		{
			'async-rule': [2, 'never'],
		},
		{
			plugins: {
				'example-plugin': {
					rules: {
						'async-rule': async () => [true, 'all good'] as const,
					},
				},
			},
		}
	);

	expect(report.valid).toBe(true);
});
