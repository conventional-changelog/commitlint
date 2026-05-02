import { test, expect } from "vitest";

import { format, formatResult } from "./index.js";

test("does nothing without arguments", () => {
	const actual = format();
	expect(actual).toEqual("");
});

test("does nothing without report results", () => {
	const actual = format({ results: [] });
	expect(actual).toEqual("");
});

test("does nothing without .errors and .warnings", () => {
	const actual = format({ results: [{}] });
	expect(actual).toEqual("");
});

test("returns empty summary if verbose", () => {
	const actual = format(
		{
			results: [
				{
					errors: [],
					warnings: [],
				},
			],
		},
		{
			verbose: true,
		},
	);

	expect(actual).toContain("0 problems, 0 warnings");
});

test("returns empty summary with full commit message if verbose", () => {
	const actual = format(
		{
			results: [
				{
					errors: [],
					warnings: [],
					input:
						"feat(cli): this is a valid header\n\nThis is a valid body\n\nSigned-off-by: tester",
				},
			],
		},
		{
			verbose: true,
			color: false,
		},
	);

	expect(actual).toStrictEqual(
		"⧗   input: feat(cli): this is a valid header\n           \n           This is a valid body\n           \n           Signed-off-by: tester\n✔   found 0 problems, 0 warnings",
	);
});

test("returns a correct summary of empty .errors and .warnings", () => {
	const actualError = format({
		results: [
			{
				errors: [
					{
						level: 2,
						name: "error-name",
						message: "There was an error",
					},
				],
			},
		],
	});

	const actualWarning = format({
		results: [
			{
				warnings: [
					{
						level: 1,
						name: "warning-name",
						message: "There was a problem",
					},
				],
			},
		],
	});

	expect(actualError).toContain("There was an error");
	expect(actualError).toContain("1 problems, 0 warnings");
	expect(actualWarning).toContain("There was a problem");
	expect(actualWarning).toContain("0 problems, 1 warnings");
});

test("uses appropriate signs by default", () => {
	const actualError = format({
		results: [
			{
				errors: [
					{
						level: 2,
						name: "error-name",
						message: "There was an error",
					},
				],
			},
		],
	});

	const actualWarning = format({
		results: [
			{
				warnings: [
					{
						level: 1,
						name: "warning-name",
						message: "There was a problem",
					},
				],
			},
		],
	});

	expect(actualError).toContain("✖");
	expect(actualWarning).toContain("⚠");
});

test("uses signs as configured", () => {
	const options = { signs: ["HNT", "WRN", "ERR"] as [string, string, string] };
	const actualError = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: "error-name",
							message: "There was an error",
						},
					],
				},
			],
		},
		options,
	);

	const actualWarning = format(
		{
			results: [
				{
					warnings: [
						{
							level: 1,
							name: "warning-name",
							message: "There was a problem",
						},
					],
				},
			],
		},
		options,
	);

	expect(actualError).toContain("ERR");
	expect(actualWarning).toContain("WRN");
});

test("format result is empty without arguments", () => {
	const actual = formatResult();
	const actualText = actual.join("\n");
	expect(actualText).toBe("");
});

test("format result transforms error to text", () => {
	const actual = formatResult({
		errors: [
			{
				level: 2,
				name: "error-name",
				message: "There was an error",
			},
		],
	});

	const actualText = actual.join("\n");

	expect(actualText).toContain("error-name");
	expect(actualText).toContain("There was an error");
	expect(actualText).toContain("1 problems, 0 warnings");
});

test("format result transforms warning to text", () => {
	const actual = formatResult({
		warnings: [
			{
				level: 1,
				name: "warning-name",
				message: "There was a warning",
			},
		],
	});

	const actualText = actual.join("\n");

	expect(actualText).toContain("warning-name");
	expect(actualText).toContain("There was a warning");
	expect(actualText).toContain("0 problems, 1 warnings");
});

test("format result prints help for errors", () => {
	const actual = formatResult(
		{
			errors: [
				{
					level: 2,
					name: "error-name",
					message: "There was an error",
				},
			],
		},
		{
			helpUrl: "https://example.com",
		},
	);

	expect(actual).toEqual(
		expect.arrayContaining([expect.stringContaining("Get help:")]),
	);
});

test("format result prints help for warnings", () => {
	const actual = formatResult(
		{
			warnings: [
				{
					level: 2,
					name: "warning-name",
					message: "There was a warning",
				},
			],
		},
		{
			helpUrl: "https://example.com",
		},
	);

	expect(actual).toEqual(
		expect.arrayContaining([expect.stringContaining("Get help:")]),
	);
});

test("format result help cotains options.helpUrl", () => {
	const helpUrl = "https://example.com";

	const actual = formatResult(
		{
			warnings: [
				{
					level: 2,
					name: "warning-name",
					message: "There was a warning",
				},
			],
		},
		{
			helpUrl,
		},
	);

	expect(actual).toEqual(
		expect.arrayContaining([expect.stringContaining(helpUrl)]),
	);
});

test("format result omits help for empty problems", () => {
	const actual = formatResult({
		warnings: [],
	});

	expect(actual).not.toEqual(
		expect.arrayContaining([expect.stringContaining("Get help:")]),
	);
});

test("format result should not contain `Get help` prefix if helpUrl is not provided", () => {
	const actual = formatResult(
		{
			warnings: [
				{
					level: 2,
					name: "warning-name",
					message: "There was a warning",
				},
			],
		},
		{
			helpUrl: "",
		},
	);

	expect(actual).not.toEqual(
		expect.arrayContaining([expect.stringContaining("Get help:")]),
	);
});

test("shows position indicator when showPosition is true and error has position", () => {
	const actual = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: "type-enum",
							message: "type must be one of [feat, fix]",
							start: { line: 1, column: 1, offset: 0 },
							end: { line: 1, column: 4, offset: 3 },
						},
					],
					input: "foo: some message",
				},
			],
		},
		{
			showPosition: true,
			color: false,
		},
	);

	expect(actual).toContain("^");
});

test("does not show position indicator when showPosition is false", () => {
	const actual = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: "type-enum",
							message: "type must be one of [feat, fix]",
							start: { line: 1, column: 1, offset: 0 },
							end: { line: 1, column: 4, offset: 3 },
						},
					],
					input: "foo: some message",
				},
			],
		},
		{
			showPosition: false,
			color: false,
		},
	);

	expect(actual).not.toContain("^");
});

test("shows position indicator when showPosition is not provided (default)", () => {
	const actual = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: "type-enum",
							message: "type must be one of [feat, fix]",
							start: { line: 1, column: 1, offset: 0 },
							end: { line: 1, column: 4, offset: 3 },
						},
					],
					input: "foo: some message",
				},
			],
		},
		{
			color: false,
		},
	);

	expect(actual).toContain("^");
});

test("does not show position indicator when error has no position", () => {
	const actual = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: "type-enum",
							message: "type must be one of [feat, fix]",
						},
					],
					input: "foo: some message",
				},
			],
		},
		{
			showPosition: true,
			color: false,
		},
	);

	expect(actual).not.toContain("^");
});

test("shows correct position for subject error", () => {
	const actual = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: "subject-max-length",
							message: "subject must not be longer than 72 characters",
							start: { line: 1, column: 10, offset: 9 },
							end: { line: 1, column: 50, offset: 49 },
						},
					],
					input:
						"feat: this is a subject that is way too long for the commit message format",
				},
			],
		},
		{
			showPosition: true,
			color: false,
		},
	);

	expect(actual).toContain("^");
});

test("renders position indicator under the failing line for multi-line input", () => {
	const actual = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: "body-max-line-length",
							message: "body must not have lines longer than 80 characters",
							start: { line: 3, column: 1, offset: 14 },
							end: { line: 3, column: 100, offset: 113 },
						},
					],
					input: "feat: header\n\nthis body line is far too long to fit",
				},
			],
		},
		{
			showPosition: true,
			color: false,
		},
	);

	const lines = actual.split("\n");
	const bodyLineIndex = lines.findIndex((l) =>
		l.includes("this body line is far too long"),
	);
	expect(bodyLineIndex).toBeGreaterThan(-1);
	expect(lines[bodyLineIndex + 1]).toContain("^");
});

test("shows position indicator with single caret for longer errors", () => {
	const actual = format(
		{
			results: [
				{
					errors: [
						{
							level: 2,
							name: "header-max-length",
							message: "header must not be longer than 100 characters",
							start: { line: 1, column: 1, offset: 0 },
							end: { line: 1, column: 80, offset: 79 },
						},
					],
					input:
						"feat: this is a very long header that exceeds the maximum allowed character limit for the commit message",
				},
			],
		},
		{
			showPosition: true,
			color: false,
		},
	);

	expect(actual).toContain("^");
});
