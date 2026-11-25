import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { footerMaxLineLength } from "./footer-max-line-length.js";

const short = "BREAKING CHANGE: a";
const long = "BREAKING CHANGE: ab";
const coAuthoredByBare = "Co-Authored-By: my-really-long-email-address@my-really-long-domain.com";
const coAuthoredByAngle =
	"Co-authored-by: Very Long Contributor Name <12345678+very-long-username@users.noreply.github.com>";

const value = short.length;

const messages = {
	simple: "test: subject",
	empty: "test: subject\nbody",
	short: `test: subject\n${short}`,
	long: `test: subject\n${long}`,
	shortMultipleLines: `test:subject\n${short}\n${short}\n${short}`,
	longMultipleLines: `test:subject\n${short}\n${long}\n${short}`,
	coAuthoredByBare: `test: subject\n\nbody\n\n${coAuthoredByBare}`,
	coAuthoredByAngle: `test: subject\n\nbody\n\n${coAuthoredByAngle}`,
	coAuthoredByWithBreakingChange: `test: subject\n\nbody\n\n${short}\n${coAuthoredByAngle}`,
	coAuthoredByWithLongLine: `test: subject\n\nbody\n\n${long}\n${coAuthoredByAngle}`,
};

const parsed = {
	simple: parse(messages.simple),
	empty: parse(messages.empty),
	short: parse(messages.short),
	long: parse(messages.long),
	coAuthoredByBare: parse(messages.coAuthoredByBare),
	coAuthoredByAngle: parse(messages.coAuthoredByAngle),
	coAuthoredByWithBreakingChange: parse(messages.coAuthoredByWithBreakingChange),
	coAuthoredByWithLongLine: parse(messages.coAuthoredByWithLongLine),
};

test("with simple should succeed", async () => {
	const [actual] = footerMaxLineLength(await parsed.simple, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with empty should succeed", async () => {
	const [actual] = footerMaxLineLength(await parsed.empty, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with short should succeed", async () => {
	const [actual] = footerMaxLineLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with long should fail", async () => {
	const [actual] = footerMaxLineLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with short with multiple lines should succeed", async () => {
	const [actual] = footerMaxLineLength(await parsed.short, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with long with multiple lines should fail", async () => {
	const [actual] = footerMaxLineLength(await parsed.long, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});

test("with Co-Authored-By bare email in footer should succeed", async () => {
	const [actual] = footerMaxLineLength(await parsed.coAuthoredByBare, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with Co-authored-by angle-bracketed email in footer should succeed", async () => {
	const [actual] = footerMaxLineLength(await parsed.coAuthoredByAngle, undefined, value);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with BREAKING CHANGE and Co-authored-by email in footer should succeed", async () => {
	const [actual] = footerMaxLineLength(
		await parsed.coAuthoredByWithBreakingChange,
		undefined,
		value,
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with long footer line alongside Co-authored-by email should fail", async () => {
	const [actual] = footerMaxLineLength(await parsed.coAuthoredByWithLongLine, undefined, value);
	const expected = false;
	expect(actual).toEqual(expected);
});
