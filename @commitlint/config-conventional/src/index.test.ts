import { test, expect } from "vitest";
import path from "node:path";
import { pathToFileURL } from "node:url";

import lint from "@commitlint/lint";

import config from "./index.js";

const { rules, parserPreset } = config;

const dynamicImport = async (id: string) => {
	const imported = await import(
		path.isAbsolute(id) ? pathToFileURL(id).toString() : id
	);
	return ("default" in imported && imported.default) || imported;
};

const commitLint = async (message: string) => {
	const preset = await (await dynamicImport(parserPreset))();
	return lint(message, rules, {
		parserOpts: preset.parser || preset.parserOpts,
	});
};

const messages = {
	invalidTypeEnum: "foo: some message",
	invalidTypeCase: "FIX: some message",
	invalidTypeEmpty: ": some message",
	invalidSubjectCases: [
		"fix(scope): Some message",
		"fix(scope): Some Message",
		"fix(scope): SomeMessage",
		"fix(scope): SOMEMESSAGE",
	],
	invalidSubjectEmpty: "fix:",
	invalidSubjectFullStop: "fix: some message.",
	invalidHeaderMaxLength:
		"fix: some message that is way too long and breaks the line max-length by several characters since the max is 100",
	warningFooterLeadingBlank:
		"fix: some message\n\nbody\nBREAKING CHANGE: It will be significant",
	invalidFooterMaxLineLength:
		'fix: some message\n\nbody\n\nBREAKING CHANGE: footer with multiple lines\nhas a message that is way too long and will break the line rule "line-max-length" by several characters',
	warningBodyLeadingBlank: "fix: some message\nbody",
	invalidBodyMaxLineLength:
		'fix: some message\n\nbody with multiple lines\nhas a message that is way too long and will break the line rule "line-max-length" by several characters',
	validMessages: [
		"fix: some message",
		"fix(scope): some message",
		"fix(scope): some Message",
		"fix(scope): some message\n\nBREAKING CHANGE: it will be significant!",
		"fix(scope): some message\n\nbody",
		"fix(scope)!: some message\n\nbody",
	],
};

const errors = {
	typeEnum: {
		level: 2,
		message:
			"type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]",
		name: "type-enum",
		valid: false,
	},
	typeCase: {
		level: 2,
		message: "type must be lower-case",
		name: "type-case",
		valid: false,
	},
	typeEmpty: {
		level: 2,
		message: "type may not be empty",
		name: "type-empty",
		valid: false,
	},
	subjectCase: {
		level: 2,
		message:
			"subject must not be sentence-case, start-case, pascal-case, upper-case",
		name: "subject-case",
		valid: false,
	},
	subjectEmpty: {
		level: 2,
		message: "subject may not be empty",
		name: "subject-empty",
		valid: false,
	},
	subjectFullStop: {
		level: 2,
		message: "subject may not end with full stop",
		name: "subject-full-stop",
		valid: false,
	},
	headerMaxLength: {
		level: 2,
		message:
			"header must not be longer than 100 characters, current length is 112",
		name: "header-max-length",
		valid: false,
	},
	footerMaxLineLength: {
		level: 2,
		message: "footer's lines must not be longer than 100 characters",
		name: "footer-max-line-length",
		valid: false,
	},
	bodyMaxLineLength: {
		level: 2,
		message: "body's lines must not be longer than 100 characters",
		name: "body-max-line-length",
		valid: false,
	},
};

const warnings = {
	footerLeadingBlank: {
		level: 1,
		message: "footer must have leading blank line",
		name: "footer-leading-blank",
		valid: false,
	},
	bodyLeadingBlank: {
		level: 1,
		message: "body must have leading blank line",
		name: "body-leading-blank",
		valid: false,
	},
};

test("type-enum", async () => {
	const result = await commitLint(messages.invalidTypeEnum);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([
		{
			...errors.typeEnum,
			start: { line: 1, column: 1, offset: 0 },
			end: { line: 1, column: 4, offset: 3 },
		},
	]);
});

test("type-case", async () => {
	const result = await commitLint(messages.invalidTypeCase);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([
		{
			...errors.typeCase,
			start: { line: 1, column: 1, offset: 0 },
			end: { line: 1, column: 4, offset: 3 },
		},
		{
			...errors.typeEnum,
			start: { line: 1, column: 1, offset: 0 },
			end: { line: 1, column: 4, offset: 3 },
		},
	]);
});

test("type-empty", async () => {
	const result = await commitLint(messages.invalidTypeEmpty);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([
		{
			...errors.typeEmpty,
			start: { line: 1, column: 1, offset: 0 },
			end: { line: 1, column: 1, offset: 0 },
		},
	]);
});

test("subject-case", async () => {
	const invalidInputs = await Promise.all(
		messages.invalidSubjectCases.map((invalidInput) =>
			commitLint(invalidInput),
		),
	);

	const headerPrefix = "fix(scope): ";
	invalidInputs.forEach((result, i) => {
		const input = messages.invalidSubjectCases[i];
		const subject = input.slice(headerPrefix.length);
		const offset = headerPrefix.length;
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual([
			{
				...errors.subjectCase,
				start: { line: 1, column: offset + 1, offset },
				end: {
					line: 1,
					column: offset + subject.length + 1,
					offset: offset + subject.length,
				},
			},
		]);
	});
});

test("subject-empty", async () => {
	const result = await commitLint(messages.invalidSubjectEmpty);

	expect(result.valid).toBe(false);
	// "fix:" — header length 4; type "fix" at offset 0 length 3.
	expect(result.errors).toEqual([
		{
			...errors.subjectEmpty,
			start: { line: 1, column: 5, offset: 4 },
			end: { line: 1, column: 5, offset: 4 },
		},
		{
			...errors.typeEmpty,
			start: { line: 1, column: 1, offset: 0 },
			end: { line: 1, column: 1, offset: 0 },
		},
	]);
});

test("subject-full-stop", async () => {
	const result = await commitLint(messages.invalidSubjectFullStop);

	expect(result.valid).toBe(false);
	// "fix: some message." — subject "some message." at offset 5, length 13
	// (parser keeps the trailing period in parsed.subject).
	expect(result.errors).toEqual([
		{
			...errors.subjectFullStop,
			start: { line: 1, column: 6, offset: 5 },
			end: { line: 1, column: 19, offset: 18 },
		},
	]);
});

test("header-max-length", async () => {
	const result = await commitLint(messages.invalidHeaderMaxLength);
	const header = messages.invalidHeaderMaxLength;

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual([
		{
			...errors.headerMaxLength,
			start: { line: 1, column: 1, offset: 0 },
			end: { line: 1, column: header.length + 1, offset: header.length },
		},
	]);
});

test("footer-leading-blank", async () => {
	const result = await commitLint(messages.warningFooterLeadingBlank);
	const message = messages.warningFooterLeadingBlank;
	const footerOffset = message.indexOf("BREAKING CHANGE") - 1;

	expect(result.valid).toBe(true);
	expect(result.warnings).toEqual([
		{
			...warnings.footerLeadingBlank,
			start: {
				line: 3,
				column: message.split("\n")[2].length + 1,
				offset: footerOffset,
			},
			end: {
				line: 3,
				column: message.split("\n")[2].length + 1,
				offset: footerOffset,
			},
		},
	]);
});

test("footer-max-line-length", async () => {
	const result = await commitLint(messages.invalidFooterMaxLineLength);

	expect(result.valid).toBe(false);
	expect(result.errors).toHaveLength(1);
	expect(result.errors[0]).toMatchObject(errors.footerMaxLineLength);
	expect(result.errors[0].start).toBeDefined();
	expect(result.errors[0].end).toBeDefined();
});

test("body-leading-blank", async () => {
	const result = await commitLint(messages.warningBodyLeadingBlank);
	const message = messages.warningBodyLeadingBlank;
	const headerLength = message.split("\n")[0].length;

	expect(result.valid).toBe(true);
	expect(result.warnings).toEqual([
		{
			...warnings.bodyLeadingBlank,
			start: {
				line: 1,
				column: headerLength + 1,
				offset: headerLength,
			},
			end: {
				line: 1,
				column: headerLength + 1,
				offset: headerLength,
			},
		},
	]);
});

test("body-max-line-length", async () => {
	const result = await commitLint(messages.invalidBodyMaxLineLength);

	expect(result.valid).toBe(false);
	expect(result.errors).toHaveLength(1);
	expect(result.errors[0]).toMatchObject(errors.bodyMaxLineLength);
	expect(result.errors[0].start).toBeDefined();
	expect(result.errors[0].end).toBeDefined();
});

test("valid messages", async () => {
	const validInputs = await Promise.all(
		messages.validMessages.map((input) => commitLint(input)),
	);

	validInputs.forEach((result) => {
		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
		expect(result.warnings).toEqual([]);
	});
});
