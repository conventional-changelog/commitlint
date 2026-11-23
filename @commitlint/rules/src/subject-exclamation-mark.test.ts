import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import type { ParserOptions } from "conventional-commits-parser";
import preset from "conventional-changelog-angular";

import { subjectExclamationMark } from "./subject-exclamation-mark.js";

const parseMessage = async (str: string) => {
	const { parser } = (await preset()) as { parser: ParserOptions };
	return parse(str, undefined, parser);
};

const messages = {
	empty: "test:\n",
	with: `test!: subject\n`,
	without: `test: subject\n`,
	withNonAscii: "功能!: 新增登录\n",
	withNonAsciiScope: "修复(界面)!: 调整布局\n",
	withCombiningMark: "सुधार!: subject\n",
	withoutNonAscii: "功能: 新增登录\n",
};

const parsed = {
	empty: parseMessage(messages.empty),
	with: parseMessage(messages.with),
	without: parseMessage(messages.without),
	withNonAscii: parseMessage(messages.withNonAscii),
	withNonAsciiScope: parseMessage(messages.withNonAsciiScope),
	withCombiningMark: parseMessage(messages.withCombiningMark),
	withoutNonAscii: parseMessage(messages.withoutNonAscii),
};

test('empty against "always" should fail', async () => {
	const [actual] = subjectExclamationMark(await parsed.empty, "always");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('empty against "never" should succeed', async () => {
	const [actual] = subjectExclamationMark(await parsed.empty, "never");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "always" should succeed', async () => {
	const [actual] = subjectExclamationMark(await parsed.with, "always");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "never" should fail', async () => {
	const [actual] = subjectExclamationMark(await parsed.with, "never");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "always" should fail', async () => {
	const [actual] = subjectExclamationMark(await parsed.without, "always");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "never" should succeed', async () => {
	const [actual] = subjectExclamationMark(await parsed.without, "never");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('withNonAscii against "always" should succeed', async () => {
	const [actual] = subjectExclamationMark(await parsed.withNonAscii, "always");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('withNonAsciiScope against "never" should fail', async () => {
	const [actual] = subjectExclamationMark(await parsed.withNonAsciiScope, "never");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('withCombiningMark against "always" should succeed', async () => {
	const [actual] = subjectExclamationMark(await parsed.withCombiningMark, "always");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('withoutNonAscii against "always" should fail', async () => {
	const [actual] = subjectExclamationMark(await parsed.withoutNonAscii, "always");
	const expected = false;
	expect(actual).toEqual(expected);
});
