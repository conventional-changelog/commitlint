import test from 'ava';
import hasAnsi from 'has-ansi';
import chalk from 'chalk';
import {yellow, red, magenta, blue} from 'ansi-styles';
import {includes} from 'lodash';
import format from './format';

const ok = chalk.bold(`${chalk.green('✔')}   found 0 problems, 0 warnings`);

test('does nothing without arguments', t => {
	const actual = format();
	t.deepEqual(actual, [ok]);
});

test('does nothing without .errors and .warnings', t => {
	const actual = format({});
	t.deepEqual(actual, [ok]);
});

test('returns empty summary of problems for empty .errors and .warnings', t => {
	const [msg] = format({
		errors: [],
		warnings: []
	});

	t.true(msg.includes('0 problems, 0 warnings'));
});

test('returns a correct of empty .errors and .warnings', t => {
	const [err, prob, msg] = format({
		errors: [
			{
				level: 2,
				name: 'error-name',
				message: 'There was an error'
			}
		],
		warnings: [
			{
				level: 1,
				name: 'warning-name',
				message: 'There was a problem'
			}
		]
	});

	t.true(includes(err, 'There was an error'));
	t.true(includes(prob, 'There was a problem'));
	t.true(includes(msg, '1 problems, 1 warnings'));
});

test('colors messages by default', t => {
	const [msg] = format({
		errors: [],
		warnings: []
	});
	t.true(hasAnsi(msg));
});

test('does not color messages if configured', t => {
	const [msg] = format({}, {color: false});
	t.false(hasAnsi(msg));
});

test('uses appropriate signs by default', t => {
	const [err, warn] = format({
		errors: [
			{
				level: 2,
				name: 'error-name',
				message: 'There was an error'
			}
		],
		warnings: [
			{
				level: 1,
				name: 'warning-name',
				message: 'There was a problem'
			}
		]
	});

	t.true(includes(err, '✖'));
	t.true(includes(warn, '⚠'));
});

test('uses signs as configured', t => {
	const [err, warn] = format(
		{
			errors: [
				{
					level: 2,
					name: 'error-name',
					message: 'There was an error'
				}
			],
			warnings: [
				{
					level: 1,
					name: 'warning-name',
					message: 'There was a problem'
				}
			]
		},
		{
			signs: ['HNT', 'WRN', 'ERR']
		}
	);

	t.true(includes(err, 'ERR'));
	t.true(includes(warn, 'WRN'));
});

test('uses appropriate colors by default', t => {
	const [err, warn] = format({
		errors: [
			{
				level: 2,
				name: 'error-name',
				message: 'There was an error'
			}
		],
		warnings: [
			{
				level: 1,
				name: 'warning-name',
				message: 'There was a problem'
			}
		]
	});

	t.true(includes(err, red.open));
	t.true(includes(warn, yellow.open));
});

if (process.platform !== 'win32') {
	test('uses colors as configured', t => {
		const [err, warn] = format(
			{
				errors: [
					{
						level: 2,
						name: 'error-name',
						message: 'There was an error'
					}
				],
				warnings: [
					{
						level: 1,
						name: 'warning-name',
						message: 'There was a problem'
					}
				]
			},
			{
				colors: ['white', 'magenta', 'blue']
			}
		);

		t.true(includes(err, blue.open));
		t.true(includes(warn, magenta.open));
	});
}
