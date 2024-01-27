import parse from '@commitlint/parse';
// @ts-expect-error -- no typings
import preset from 'conventional-changelog-angular';

import {subjectExclamationMark} from './subject-exclamation-mark.js';

const parseMessage = async (str: string) => {
	const {parserOpts} = await preset();
	return parse(str, undefined, parserOpts);
};

const messages = {
	empty: 'test:\n',
	with: `test!: subject\n`,
	without: `test: subject\n`,
};

const parsed = {
	empty: parseMessage(messages.empty),
	with: parseMessage(messages.with),
	without: parseMessage(messages.without),
};

test('empty against "always" should fail', async () => {
	const [actual] = subjectExclamationMark(await parsed.empty, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('empty against "never" should succeed', async () => {
	const [actual] = subjectExclamationMark(await parsed.empty, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "always" should succeed', async () => {
	const [actual] = subjectExclamationMark(await parsed.with, 'always');
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "never" should fail', async () => {
	const [actual] = subjectExclamationMark(await parsed.with, 'never');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "always" should fail', async () => {
	const [actual] = subjectExclamationMark(await parsed.without, 'always');
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "never" should succeed', async () => {
	const [actual] = subjectExclamationMark(await parsed.without, 'never');
	const expected = true;
	expect(actual).toEqual(expected);
});
