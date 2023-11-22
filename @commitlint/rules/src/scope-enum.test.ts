import parse from '@commitlint/parse';
import {scopeEnum} from './scope-enum';
import {RuleConfigCondition} from '@commitlint/types';

const messagesByScope = {
	single: {
		plain: 'foo(bar): baz',
	},
	multiple: {
		multiple: 'foo(bar,baz): qux',
		multipleCommaSpace: 'foo(bar, baz): qux',
	},
	none: {
		empty: 'foo: baz',
		superfluous: 'foo(): baz',
	},
};

const {single, multiple, none} = messagesByScope;

const messages = Object.values(messagesByScope).reduce(
	(acc, curr) => ({...acc, ...curr}),
	{}
);

const conditions: RuleConfigCondition[] = ['always', 'never'];

describe('Scope Enum Validation', () => {
	conditions.forEach((condition) => {
		describe('Enum without Scopes', () => {
			Object.keys(messages).forEach((messageType) => {
				test(`Succeeds with a '${messageType}' message and '${condition}'`, async () => {
					const [actual, message] = scopeEnum(
						await parse(messages[messageType]),
						condition,
						[]
					);
					const expected = true;
					expect(actual).toEqual(expected);
					expect(message).toEqual('');
				});
			});
		});

		describe('Messages without Scopes', () => {
			Object.keys(none).forEach((messageType) => {
				const fakeMessage = messages[messageType];

				it(`Succeeds with a '${messageType}' message and '${condition}' with single-scope enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						condition,
						['bar']
					);
					expect(actual).toBeTruthy();
					expect(message).toBeFalsy();
				});

				it(`Succeeds with a '${messageType}' message  and '${condition}' with multi-scope enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						condition,
						['bar', 'baz']
					);
					expect(actual).toBeTruthy();
					expect(message).toBeFalsy();
				});
			});
		});
	});

	describe('Always', () => {
		describe('Single-Scope Messages', () => {
			Object.keys(single).forEach((messageType) => {
				const fakeMessage = messages[messageType];

				it(`Succeeds with a '${messageType}' message when all message scopes are included in single-scope enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						'always',
						['bar']
					);
					expect(actual).toBeTruthy();
					expect(message).toEqual('scope must be one of [bar]');
				});

				test(`Succeeds with a '${messageType}' message when all message scopes are included in multi-scope enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						'always',
						['bar', 'baz']
					);
					expect(actual).toBeTruthy();
					expect(message).toEqual('scope must be one of [bar, baz]');
				});

				test(`Fails with a '${messageType}' message when any message scope is not included in enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						'always',
						['foo']
					);
					expect(actual).toBeFalsy();
					expect(message).toEqual('scope must be one of [foo]');
				});
			});
		});

		describe('Multi-Scope Messages', () => {
			Object.keys(multiple).forEach((messageType) => {
				const fakeMessage = messages[messageType];

				test(`Succeeds with a '${messageType}' message when all message scopes are included in enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						'always',
						['bar', 'baz']
					);
					expect(actual).toBeTruthy();
					expect(message).toEqual('scope must be one of [bar, baz]');
				});

				test(`Fails with a '${messageType}' message when no message scopes are included in enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						'always',
						['foo']
					);
					expect(actual).toBeFalsy();
					expect(message).toEqual('scope must be one of [foo]');
				});

				it(`Fails with a '${messageType}' message when only some message scopes are included in enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						'always',
						['bar']
					);
					expect(actual).toBeFalsy();
					expect(message).toEqual('scope must be one of [bar]');
				});
			});
		});
	});

	describe('Never', () => {
		describe('Messages with Scopes', () => {
			Object.keys({...single, ...multiple}).forEach((messageType) => {
				const fakeMessage = messages[messageType];

				test(`Succeeds with a '${messageType}' message when no message scopes are included in enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						'never',
						['foo']
					);
					expect(actual).toBeTruthy();
					expect(message).toEqual('scope must not be one of [foo]');
				});

				it(`Fails with a '${messageType}' message when any message scope is included in single-scope enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						'never',
						['bar']
					);
					expect(actual).toBeFalsy();
					expect(message).toEqual('scope must not be one of [bar]');
				});

				test(`Fails with a '${messageType}' message when any message scope is included in multi-scope enum`, async () => {
					const [actual, message] = scopeEnum(
						await parse(fakeMessage),
						'never',
						['bar', 'baz']
					);
					expect(actual).toBeFalsy();
					expect(message).toEqual('scope must not be one of [bar, baz]');
				});
			});
		});
	});
});
