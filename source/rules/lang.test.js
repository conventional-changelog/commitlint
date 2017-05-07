import test from 'ava';
import parse from '../library/parse';
import check from './lang';

const messages = {
	empty: '(): \n',
	eng: '(): this is a serious subject',
	deu: '(): Dies ist ein ernstes Subjekt'
};

const parsed = {
	empty: parse(messages.empty),
	eng: parse(messages.eng),
	deu: parse(messages.deu)
};

test('empty succeeds', t => {
	const [actual] = check(parsed.eng, '', 'eng');
	const expected = true;
	t.is(actual, expected);
});

test('english against "eng" succeeds', t => {
	const [actual] = check(parsed.eng, '', 'eng');
	const expected = true;
	t.is(actual, expected);
});

test('english against "always eng" succeeds', t => {
	const [actual] = check(parsed.eng, 'always', 'eng');
	const expected = true;
	t.is(actual, expected);
});

test('english against "never eng" fails', t => {
	const [actual] = check(parsed.eng, 'never', 'eng');
	const expected = false;
	t.is(actual, expected);
});

test.failing('english against "deu" fails', t => {
	const [actual] = check(parsed.eng, '', 'deu+');
	const expected = false;
	t.is(actual, expected);
});

test('english against "always deu" fails', t => {
	const [actual] = check(parsed.eng, 'always', 'deu');
	const expected = false;
	t.is(actual, expected);
});

test('english against "never deu" succeeds', t => {
	const [actual] = check(parsed.eng, 'never', 'deu');
	const expected = true;
	t.is(actual, expected);
});

test('german against "deu" succeeds', t => {
	const [actual] = check(parsed.deu, '', 'deu');
	const expected = true;
	t.is(actual, expected);
});

test('german against "always deu" succeeds', t => {
	const [actual] = check(parsed.deu, 'always', 'deu');
	const expected = true;
	t.is(actual, expected);
});

test('german against "never deu" fails', t => {
	const [actual] = check(parsed.deu, 'never', 'deu');
	const expected = false;
	t.is(actual, expected);
});
