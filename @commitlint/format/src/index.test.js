import test from 'ava';
import chalk from 'chalk';
import includes from 'lodash.includes';
import format from '.';

const ok = chalk.bold(`${chalk.green('✔')}   found 0 problems, 0 warnings`);

test('does nothing without arguments', t => {
	const actual = format();
	t.deepEqual(actual, ok);
});

test('does nothing without report results', t => {
	const actual = format({results: []});
	t.deepEqual(actual, ok);
});

test('does nothing without .errors and .warnings', t => {
	const actual = format({results: [{}]});
	t.deepEqual(actual, ok);
});

test('returns empty summary of problems for empty .errors and .warnings', t => {
	const actual = format({
		results: [
			{
				errors: [],
				warnings: []
			}
		]
	});

	t.true(actual.includes('0 problems, 0 warnings'));
});

test('returns a correct of empty .errors and .warnings', t => {
	const actualError = format({
		results: [
			{
				errors: [
					{
						level: 2,
						name: 'error-name',
						message: 'There was an error'
					}
				]
			}
		]
	});

	const actualWarning = format({
		results: [
			{
				warnings: [
					{
						level: 1,
						name: 'warning-name',
						message: 'There was a problem'
					}
				]
			}
		]
	});

	t.true(includes(actualError, 'There was an error'));
	t.true(includes(actualError, '1 problems, 0 warnings'));
	t.true(includes(actualWarning, 'There was a problem'));
	t.true(includes(actualWarning, '0 problems, 1 warnings'));
});

test('uses appropriate signs by default', t => {
	const actualError = format({
		results: [
			{
				errors: [
					{
						level: 2,
						name: 'error-name',
						message: 'There was an error'
					}
				]
			}
		]
	});

	const actualWarning = format({
		results: [
			{
				warnings: [
					{
						level: 1,
						name: 'warning-name',
						message: 'There was a problem'
					}
				]
			}
		]
	});

	t.true(includes(actualError, '✖'));
	t.true(includes(actualWarning, '⚠'));
});

test('uses signs as configured', t => {
	const options = {signs: ['HNT', 'WRN', 'ERR']};
	const actualError = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: 'error-name',
							message: 'There was an error'
						}
					]
				}
			]
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
							message: 'There was a problem'
						}
					]
				}
			]
		},
		options
	);

	t.true(includes(actualError, 'ERR'));
	t.true(includes(actualWarning, 'WRN'));
});
