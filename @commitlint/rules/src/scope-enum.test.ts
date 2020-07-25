import parse from '@commitlint/parse';
import {scopeEnum} from './scope-enum';

const messages = {
	plain: 'foo(bar): baz',
	superfluous: 'foo(): baz',
	empty: 'foo: baz',
	multiple: 'foo(bar,baz): qux',
};

const parsed = {
	plain: parse(messages.plain),
	superfluous: parse(messages.superfluous),
	empty: parse(messages.empty),
	multiple: parse(messages.multiple),
};

test('scope-enum with plain message and always should succeed empty enum', async () => {
	const [actual] = scopeEnum(await parsed.plain, 'always', []);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with plain message and never should error empty enum', async () => {
	const [actual] = scopeEnum(await parsed.plain, 'never', []);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with plain message should succeed correct enum', async () => {
	const [actual] = scopeEnum(await parsed.plain, 'always', ['bar']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with plain message should error false enum', async () => {
	const [actual] = scopeEnum(await parsed.plain, 'always', ['foo']);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('scope-enum with plain message should error forbidden enum', async () => {
	const [actual] = scopeEnum(await parsed.plain, 'never', ['bar']);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('scope-enum with plain message should succeed forbidden enum', async () => {
	const [actual] = scopeEnum(await parsed.plain, 'never', ['foo']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with superfluous scope should succeed enum', async () => {
	const [actual] = scopeEnum(await parsed.superfluous, 'always', ['bar']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with superfluous scope and "never" should succeed', async () => {
	const [actual] = scopeEnum(await parsed.superfluous, 'never', ['bar']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with superfluous scope and always should succeed empty enum', async () => {
	const [actual] = scopeEnum(await parsed.superfluous, 'always', []);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with superfluous scope and never should succeed empty enum', async () => {
	const [actual] = scopeEnum(await parsed.superfluous, 'never', []);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with empty scope and always should succeed empty enum', async () => {
	const [actual] = scopeEnum(await parsed.superfluous, 'always', []);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with empty scope and always should succeed filled enum', async () => {
	const [actual] = scopeEnum(await parsed.superfluous, 'always', ['foo']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with empty scope and never should succeed empty enum', async () => {
	const [actual] = scopeEnum(await parsed.superfluous, 'never', []);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with multiple scope should succeed on message with multiple scope', async () => {
	const [actual] = scopeEnum(await parsed.multiple, 'never', ['bar', 'baz']);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('scope-enum with multiple scope should error on message with forbidden enum', async () => {
	const [actual] = scopeEnum(await parsed.multiple, 'never', ['bar', 'qux']);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('scope-enum with multiple scope should error on message with superfluous scope', async () => {
	const [actual] = scopeEnum(await parsed.multiple, 'never', ['bar']);
	const expected = true;
	expect(actual).toEqual(expected);
});
