import {format, formatResult} from './index.js';

test('does nothing without arguments', () => {
	const actual = format();
	expect(actual).toEqual('');
});

test('does nothing without report results', () => {
	const actual = format({results: []});
	expect(actual).toEqual('');
});

test('does nothing without .errors and .warnings', () => {
	const actual = format({results: [{}]});
	expect(actual).toEqual('');
});

test('returns empty summary if verbose', () => {
	const actual = format(
		{
			results: [
				{
					errors: [],
					warnings: [],
				},
			],
		},
		{
			verbose: true,
		}
	);

	expect(actual).toContain('0 problems, 0 warnings');
});

test('returns a correct summary of empty .errors and .warnings', () => {
	const actualError = format({
		results: [
			{
				errors: [
					{
						level: 2,
						name: 'error-name',
						message: 'There was an error',
					},
				],
			},
		],
	});

	const actualWarning = format({
		results: [
			{
				warnings: [
					{
						level: 1,
						name: 'warning-name',
						message: 'There was a problem',
					},
				],
			},
		],
	});

	expect(actualError).toContain('There was an error');
	expect(actualError).toContain('1 problems, 0 warnings');
	expect(actualWarning).toContain('There was a problem');
	expect(actualWarning).toContain('0 problems, 1 warnings');
});

test('uses appropriate signs by default', () => {
	const actualError = format({
		results: [
			{
				errors: [
					{
						level: 2,
						name: 'error-name',
						message: 'There was an error',
					},
				],
			},
		],
	});

	const actualWarning = format({
		results: [
			{
				warnings: [
					{
						level: 1,
						name: 'warning-name',
						message: 'There was a problem',
					},
				],
			},
		],
	});

	expect(actualError).toContain('✖');
	expect(actualWarning).toContain('⚠');
});

test('uses signs as configured', () => {
	const options = {signs: ['HNT', 'WRN', 'ERR'] as [string, string, string]};
	const actualError = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: 'error-name',
							message: 'There was an error',
						},
					],
				},
			],
		},
		options
	);

	const actualWarning = format(
		{
			results: [
				{
					warnings: [
						{
							level: 1,
							name: 'warning-name',
							message: 'There was a problem',
						},
					],
				},
			],
		},
		options
	);

	expect(actualError).toContain('ERR');
	expect(actualWarning).toContain('WRN');
});

test('format result is empty without arguments', () => {
	const actual = formatResult();
	const actualText = actual.join('\n');
	expect(actualText).toBe('');
});

test('format result transforms error to text', () => {
	const actual = formatResult({
		errors: [
			{
				level: 2,
				name: 'error-name',
				message: 'There was an error',
			},
		],
	});

	const actualText = actual.join('\n');

	expect(actualText).toContain('error-name');
	expect(actualText).toContain('There was an error');
	expect(actualText).toContain('1 problems, 0 warnings');
});

test('format result transforms warning to text', () => {
	const actual = formatResult({
		warnings: [
			{
				level: 1,
				name: 'warning-name',
				message: 'There was a warning',
			},
		],
	});

	const actualText = actual.join('\n');

	expect(actualText).toContain('warning-name');
	expect(actualText).toContain('There was a warning');
	expect(actualText).toContain('0 problems, 1 warnings');
});

test('format result prints help for errors', () => {
	const actual = formatResult(
		{
			errors: [
				{
					level: 2,
					name: 'error-name',
					message: 'There was an error',
				},
			],
		},
		{
			helpUrl: 'https://example.com',
		}
	);

	expect(actual).toEqual(
		expect.arrayContaining([expect.stringContaining('Get help:')])
	);
});

test('format result prints help for warnings', () => {
	const actual = formatResult(
		{
			warnings: [
				{
					level: 2,
					name: 'warning-name',
					message: 'There was a warning',
				},
			],
		},
		{
			helpUrl: 'https://example.com',
		}
	);

	expect(actual).toEqual(
		expect.arrayContaining([expect.stringContaining('Get help:')])
	);
});

test('format result help cotains options.helpUrl', () => {
	const helpUrl = 'https://example.com';

	const actual = formatResult(
		{
			warnings: [
				{
					level: 2,
					name: 'warning-name',
					message: 'There was a warning',
				},
			],
		},
		{
			helpUrl,
		}
	);

	expect(actual).toEqual(
		expect.arrayContaining([expect.stringContaining(helpUrl)])
	);
});

test('format result omits help for empty problems', () => {
	const actual = formatResult({
		warnings: [],
	});

	expect(actual).not.toEqual(
		expect.arrayContaining([expect.stringContaining('Get help:')])
	);
});

test('format result should not contain `Get help` prefix if helpUrl is not provided', () => {
	const actual = formatResult(
		{
			warnings: [
				{
					level: 2,
					name: 'warning-name',
					message: 'There was a warning',
				},
			],
		},
		{
			helpUrl: '',
		}
	);

	expect(actual).not.toEqual(
		expect.arrayContaining([expect.stringContaining('Get help:')])
	);
});
