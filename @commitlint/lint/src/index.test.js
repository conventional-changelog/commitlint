import test from 'ava';
import lint from '.';

test('throws without params', async t => {
	const error = await t.throwsAsync(lint());
	t.is(error.message, 'Expected a raw commit');
});

test('throws with empty message', async t => {
	const error = await t.throwsAsync(lint(''));
	t.is(error.message, 'Expected a raw commit');
});

test('positive on stub message and no rule', async t => {
	const actual = await lint('foo: bar');
	t.true(actual.valid);
});

test('positive on stub message and adhered rule', async t => {
	const actual = await lint('foo: bar', {
		'type-enum': [2, 'always', ['foo']]
	});
	t.true(actual.valid);
});

test('negative on stub message and broken rule', async t => {
	const actual = await lint('foo: bar', {
		'type-enum': [2, 'never', ['foo']]
	});
	t.false(actual.valid);
});

test('positive on ignored message and broken rule', async t => {
	const actual = await lint('Revert "some bogus commit"', {
		'type-empty': [2, 'never']
	});
	t.true(actual.valid);
	t.is(actual.input, 'Revert "some bogus commit"');
});

test('negative on ignored message, disabled ignored messages and broken rule', async t => {
	const actual = await lint(
		'Revert "some bogus commit"',
		{
			'type-empty': [2, 'never']
		},
		{
			defaultIgnores: false
		}
	);
	t.false(actual.valid);
});

test('positive on custom ignored message and broken rule', async t => {
	const ignoredMessage = 'some ignored custom message';
	const actual = await lint(
		ignoredMessage,
		{
			'type-empty': [2, 'never']
		},
		{
			ignores: [c => c === ignoredMessage]
		}
	);
	t.true(actual.valid);
	t.is(actual.input, ignoredMessage);
});

test('positive on stub message and opts', async t => {
	const actual = await lint(
		'foo-bar',
		{
			'type-enum': [2, 'always', ['foo']],
			'type-empty': [2, 'never']
		},
		{
			parserOpts: {
				headerPattern: /^(\w*)(?:\((.*)\))?-(.*)$/
			}
		}
	);
	t.true(actual.valid);
});

test('throws for invalid rule names', async t => {
	const error = await t.throwsAsync(
		lint('foo', {foo: [2, 'always'], bar: [1, 'never']})
	);

	t.is(error.message.indexOf('Found invalid rule names: foo, bar'), 0);
});

test('throws for invalid rule config', async t => {
	const error = await t.throwsAsync(
		lint('type(scope): foo', {
			'type-enum': 1,
			'scope-enum': {0: 2, 1: 'never', 2: ['foo'], length: 3}
		})
	);

	t.true(error.message.indexOf('type-enum must be array') > -1);
	t.true(error.message.indexOf('scope-enum must be array') > -1);
});

test('allows disable shorthand', async t => {
	await t.notThrowsAsync(lint('foo', {'type-enum': [0], 'scope-enum': [0]}));
});

test('throws for rule with invalid length', async t => {
	const error = await t.throwsAsync(
		lint('type(scope): foo', {'scope-enum': [1, 2, 3, 4]})
	);

	t.true(error.message.indexOf('scope-enum must be 2 or 3 items long') > -1);
});

test('throws for rule with invalid level', async t => {
	const error = await t.throwsAsync(
		lint('type(scope): foo', {
			'type-enum': ['2', 'always'],
			'header-max-length': [{}, 'always']
		})
	);

	t.true(error.message.indexOf('rule type-enum must be number') > -1);
	t.true(error.message.indexOf('rule type-enum must be number') > -1);
});

test('throws for rule with out of range level', async t => {
	const error = await t.throwsAsync(
		lint('type(scope): foo', {
			'type-enum': [-1, 'always'],
			'header-max-length': [3, 'always']
		})
	);

	t.true(error.message.indexOf('rule type-enum must be between 0 and 2') > -1);
	t.true(error.message.indexOf('rule type-enum must be between 0 and 2') > -1);
});

test('throws for rule with invalid condition', async t => {
	const error = await t.throwsAsync(
		lint('type(scope): foo', {
			'type-enum': [1, 2],
			'header-max-length': [1, {}]
		})
	);

	t.true(error.message.indexOf('type-enum must be string') > -1);
	t.true(error.message.indexOf('header-max-length must be string') > -1);
});

test('throws for rule with out of range condition', async t => {
	const error = await t.throwsAsync(
		lint('type(scope): foo', {
			'type-enum': [1, 'foo'],
			'header-max-length': [1, 'bar']
		})
	);

	t.true(error.message.indexOf('type-enum must be "always" or "never"') > -1);
	t.true(
		error.message.indexOf('header-max-length must be "always" or "never"') > -1
	);
});

test('succeds for issue', async t => {
	const report = await lint('somehting #1', {
		'references-empty': [2, 'never']
	});

	t.true(report.valid);
});

test('fails for issue', async t => {
	const report = await lint('somehting #1', {
		'references-empty': [2, 'always']
	});

	t.false(report.valid);
});

test('succeds for custom issue prefix', async t => {
	const report = await lint(
		'somehting REF-1',
		{
			'references-empty': [2, 'never']
		},
		{
			parserOpts: {
				issuePrefixes: ['REF-']
			}
		}
	);

	t.true(report.valid);
});

test('fails for custom issue prefix', async t => {
	const report = await lint(
		'somehting #1',
		{
			'references-empty': [2, 'never']
		},
		{
			parserOpts: {
				issuePrefixes: ['REF-']
			}
		}
	);

	t.false(report.valid);
});

test('fails for custom plugin rule', async t => {
	const report = await lint(
		'somehting #1',
		{
			'plugin-rule': [2, 'never']
		},
		{
			plugins: {
				'plugin-example': {
					rules: {
						'plugin-rule': () => [false]
					}
				}
			}
		}
	);

	t.false(report.valid);
});

test('passes for custom plugin rule', async t => {
	const report = await lint(
		'somehting #1',
		{
			'plugin-rule': [2, 'never']
		},
		{
			plugins: {
				'plugin-example': {
					rules: {
						'plugin-rule': () => [true]
					}
				}
			}
		}
	);

	t.true(report.valid);
});

test('returns original message only with commit header', async t => {
	const message = 'foo: bar';
	const report = await lint(message);

	t.is(report.input, message);
});

test('returns original message with commit header and body', async t => {
	const message = 'foo: bar/n/nFoo bar bizz buzz.';
	const report = await lint(message);

	t.is(report.input, message);
});

test('returns original message with commit header, body and footer', async t => {
	const message = 'foo: bar/n/nFoo bar bizz buzz./n/nCloses #1';
	const report = await lint(message);

	t.is(report.input, message);
});

test('returns original message with commit header, body and footer, parsing comments', async t => {
	const expected = 'foo: bar/n/nFoo bar bizz buzz./n/nCloses #1';
	const message = `${expected}\n\n# Some comment to ignore`;
	const report = await lint(
		message,
		{
			'references-empty': [2, 'never']
		},
		{
			parserOpts: {
				commentChar: '#'
			}
		}
	);

	t.is(report.input, expected);
});
