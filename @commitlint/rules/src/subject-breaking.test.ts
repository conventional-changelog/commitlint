import parse from '@commitlint/parse';
import {subjectBreaking} from './subject-breaking';

const messages = {
	empty: 'test: \nbody',
	filled: 'BREAKING CHANGE: this one',
};

const parsed = {
	empty: parse(messages.empty),
	filled: parse(messages.filled),
};

test('without subject should succeed', async () => {
	const [actual] = subjectBreaking(await parsed.empty);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('subject fail with BREAKING CHANGE:', async () => {
	const [actual] = subjectBreaking(await parsed.filled);
	const expected = false;
	expect(actual).toEqual(expected);
});
