import parse from '@commitlint/parse';
import {Commit} from '@commitlint/types';
import {headerTrim} from './header-trim';

const messages = {
	correct: 'test: subject',

	whitespaceStart: ' test: subject',
	whitespaceEnd: 'test: subject  ',
	whitespaceSurround: ' test: subject ',

	tabStart: '\t\ttest: subject',
	tabEnd: 'test: subject\t\t',
	tabSurround: '\t\ttest: subject\t',

	mixStart: '\t\ttest: subject',
	mixEnd: 'test: subject\t\t',
	mixSurround: '\t \ttest: subject \t  \t',
};

const parsed = Object.entries(messages).reduce((_parsed, [key, message]) => {
	_parsed[key] = parse(message);
	return _parsed;
}, {}) as Record<keyof typeof messages, Promise<Commit>>;

test('should succeed when header is not surrounded by whitespace', async () => {
	const result = headerTrim(await parsed.correct);
	expect(result).toEqual(expect.arrayContaining([true]));
});

(
	[
		['mixed whitespace', parsed.mixStart],
		['whitespace', parsed.whitespaceStart],
		['tab', parsed.tabStart],
	] as const
).forEach(([desc, commit]) => {
	test(`should fail with ${desc}`, async () => {
		const result = headerTrim(await commit);
		expect(result).toEqual(
			expect.arrayContaining([false, 'header must not start with whitespace'])
		);
	});
});

(
	[
		['mixed whitespace', parsed.mixEnd],
		['whitespace', parsed.whitespaceEnd],
		['tab', parsed.tabEnd],
	] as const
).forEach(([desc, commit]) => {
	test(`should fail when ends with ${desc}`, async () => {
		const result = headerTrim(await commit);
		expect(result).toEqual(
			expect.arrayContaining([false, 'header must not end with whitespace'])
		);
	});
});

(
	[
		['mixed whitespace', parsed.mixSurround],
		['whitespace', parsed.whitespaceSurround],
		['tab', parsed.tabSurround],
	] as const
).forEach(([desc, commit]) => {
	test(`should fail when surrounded by ${desc}`, async () => {
		const result = headerTrim(await commit);
		expect(result).toEqual(
			expect.arrayContaining([
				false,
				'header must not be surrounded by whitespace',
			])
		);
	});
});
