import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { breakingChangeExclamationMark } from "./breaking-change-exclamation-mark.js";

const noHeader = "commit message";
const plainHeader = "type: subject";
const breakingHeader = "type!: subject";
const noFooter = "";
const plainFooter = "Some-Other-Trailer: content";
const breakingFooter = "BREAKING CHANGE: reason";

// These are equivalence partitions.
const messages = {
	noHeaderNoFooter: `${noHeader}\n\n${noFooter}`,
	noHeaderPlainFooter: `${noHeader}\n\n${plainFooter}`,
	noHeaderBreakingFooter: `${noHeader}\n\n${breakingFooter}`,
	plainHeaderPlainFooter: `${plainHeader}\n\n${plainFooter}`,
	plainHeaderBreakingFooter: `${plainHeader}\n\n${breakingFooter}`,
	breakingHeaderPlainFooter: `${breakingHeader}\n\n${plainFooter}`,
	breakingHeaderBreakingFooter: `${breakingHeader}\n\n${breakingFooter}`,
};

const parsed = {
	noHeaderNoFooter: parse(messages.noHeaderNoFooter),
	noHeaderPlainFooter: parse(messages.noHeaderPlainFooter),
	noHeaderBreakingFooter: parse(messages.noHeaderBreakingFooter),
	plainHeaderPlainFooter: parse(messages.plainHeaderPlainFooter),
	plainHeaderBreakingFooter: parse(messages.plainHeaderBreakingFooter),
	breakingHeaderPlainFooter: parse(messages.breakingHeaderPlainFooter),
	breakingHeaderBreakingFooter: parse(messages.breakingHeaderBreakingFooter),
};

test("with noHeaderNoFooter should succeed", async () => {
	const [actual] = breakingChangeExclamationMark(await parsed.noHeaderNoFooter);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with noHeaderPlainFooter should succeed", async () => {
	const [actual] = breakingChangeExclamationMark(
		await parsed.noHeaderPlainFooter,
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with noHeaderBreakingFooter should fail", async () => {
	const [actual] = breakingChangeExclamationMark(
		await parsed.noHeaderBreakingFooter,
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with plainHeaderPlainFooter should succeed", async () => {
	const [actual] = breakingChangeExclamationMark(
		await parsed.plainHeaderPlainFooter,
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with plainHeaderBreakingFooter should fail", async () => {
	const [actual] = breakingChangeExclamationMark(
		await parsed.plainHeaderBreakingFooter,
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with breakingHeaderPlainFooter should fail", async () => {
	const [actual] = breakingChangeExclamationMark(
		await parsed.breakingHeaderPlainFooter,
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with breakingHeaderBreakingFooter should succeed", async () => {
	const [actual] = breakingChangeExclamationMark(
		await parsed.breakingHeaderBreakingFooter,
	);
	const expected = true;
	expect(actual).toEqual(expected);
});
