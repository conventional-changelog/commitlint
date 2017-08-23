import test from 'ava';
import {includes} from 'lodash';
import ensure from './ensure-language';

test('true for no params', t => {
	const actual = ensure();
	t.is(actual.matches, true);
	t.is(includes(actual.detected, 'und'), true);
});

test.failing('true for chinese on chi', t => {
	const actual = ensure('這是一個嚴重的問題', 'chi');
	t.is(actual.matches, true);
	t.is(includes(actual.detected, 'chi'), true);
});

test('true for spanish on spa', t => {
	const actual = ensure('Este es un asunto serio', 'spa');
	t.is(actual.matches, true);
	t.is(includes(actual.detected, 'spa'), true);
});

test('true for english on eng', t => {
	const actual = ensure('This is a serious subject', 'eng');
	t.is(actual.matches, true);
	t.is(includes(actual.detected, 'eng'), true);
});

test('true for hindi on hin', t => {
	const actual = ensure('यह एक गंभीर मुद्दा है', 'hin');
	t.is(actual.matches, true);
	t.is(includes(actual.detected, 'hin'), true);
});

test('true for portugese on por', t => {
	const actual = ensure('Este é um assunto sério', 'por');
	t.is(actual.matches, true);
	t.is(includes(actual.detected, 'por'), true);
});

test.failing('false for chinese on eng', t => {
	const actual = ensure('這是一個嚴重的問題', 'eng');
	t.is(actual.matches, false);
	t.is(includes(actual.detected, 'chi'), true);
});

test('false for spanish on eng', t => {
	const actual = ensure('Este es un asunto serio', 'eng');
	t.is(actual.matches, false);
	t.is(includes(actual.detected, 'spa'), true);
});

test('false for hindi on eng', t => {
	const actual = ensure('यह एक गंभीर मुद्दा है', 'eng');
	t.is(actual.matches, false);
	t.is(includes(actual.detected, 'hin'), true);
});

test('false for portugese on eng', t => {
	const actual = ensure('Este é um assunto sério', 'eng');
	t.is(actual.matches, false);
	t.is(includes(actual.detected, 'por'), true);
});
