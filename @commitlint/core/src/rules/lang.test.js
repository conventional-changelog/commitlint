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

test('empty succeeds', async t => {
	const [actual] = check(await parsed.eng, '', 'eng');
	const expected = true;
	t.is(actual, expected);
});

test('english against "eng" succeeds', async t => {
	const [actual] = check(await parsed.eng, '', 'eng');
	const expected = true;
	t.is(actual, expected);
});

test('english against "always eng" succeeds', async t => {
	const [actual] = check(await parsed.eng, 'always', 'eng');
	const expected = true;
	t.is(actual, expected);
});

test('english against "never eng" fails', async t => {
	const [actual] = check(await parsed.eng, 'never', 'eng');
	const expected = false;
	t.is(actual, expected);
});

test('english against "deu" fails', async t => {
	const [actual] = check(await parsed.eng, '', 'deu+');
	const expected = false;
	t.is(actual, expected);
});

test('english against "always deu" fails', async t => {
	const [actual] = check(await parsed.eng, 'always', 'deu');
	const expected = false;
	t.is(actual, expected);
});

test('english against "never deu" succeeds', async t => {
	const [actual] = check(await parsed.eng, 'never', 'deu');
	const expected = true;
	t.is(actual, expected);
});

test('german against "deu" succeeds', async t => {
	const [actual] = check(await parsed.deu, '', 'deu');
	const expected = true;
	t.is(actual, expected);
});

test('german against "always deu" succeeds', async t => {
	const [actual] = check(await parsed.deu, 'always', 'deu');
	const expected = true;
	t.is(actual, expected);
});

test('german against "never deu" fails', async t => {
	const [actual] = check(await parsed.deu, 'never', 'deu');
	const expected = false;
	t.is(actual, expected);
});
