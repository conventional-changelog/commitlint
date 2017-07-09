import test from 'ava';

test('exports format method', t => {
	const {format} = require('.');
	t.is(typeof format, 'function');
});

test('exports lint method', t => {
	const {lint} = require('.');
	t.is(typeof lint, 'function');
});

test('exports load method', t => {
	const {load} = require('.');
	t.is(typeof load, 'function');
});

test('exports read method', t => {
	const {read} = require('.');
	t.is(typeof read, 'function');
});
