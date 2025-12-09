import { describe, test, expect } from "vitest";
import parse from "@commitlint/parse";
import { scopeDelimiterStyle } from "./scope-delimiter-style.js";

const messages = {
	noScope: "feat: subject",

	kebabScope: "feat(lint-staged): subject",
	snakeScope: "feat(my_scope): subject",

	defaultSlash: "feat(core/api): subject",
	defaultComma: "feat(core,api): subject",
	defaultCommaSpace: "feat(core, api): subject",
	defaultBackslash: "feat(core\\api): subject",

	nonDefaultPipe: "feat(core|api): subject",
	nonDefaultStar: "feat(core*api): subject",
	mixedCustom: "feat(core|api/utils): subject",
} as const;

describe("Scope Delimiter Validation", () => {
	describe("Messages without scopes", () => {
		test('Succeeds for "always" when there is no scope', async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.noScope),
				"always",
			);

			expect(actual).toEqual(true);
			expect(error).toEqual(undefined);
		});

		test('Succeeds for "never" when there is no scope', async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.noScope),
				"never",
			);

			expect(actual).toEqual(true);
			expect(error).toEqual(undefined);
		});
	});

	describe('"always" with default configuration', () => {
		test.each([
			{ scenario: "kebab-case scope", commit: messages.kebabScope },
			{ scenario: "snake_case scope", commit: messages.snakeScope },
		] as const)(
			"Treats $scenario as part of the scope and not a delimiter",
			async ({ commit }) => {
				const [actual, error] = scopeDelimiterStyle(
					await parse(commit),
					"always",
				);

				expect(actual).toEqual(true);
				expect(error).toEqual("scope delimiters must be one of [/, \\, ,]");
			},
		);

		test.each([
			{ scenario: "comma ',' delimiter", commit: messages.defaultComma },
			{ scenario: "slash '/' delimiter", commit: messages.defaultSlash },
			{
				scenario: "backslash '\\' delimiter",
				commit: messages.defaultBackslash,
			},
		] as const)("Succeeds when only $scenario is used", async ({ commit }) => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(commit),
				"always",
			);

			expect(actual).toEqual(true);
			expect(error).toEqual("scope delimiters must be one of [/, \\, ,]");
		});

		test.each([
			{ scenario: "comma without space", commit: messages.defaultComma },
			{ scenario: "comma with space", commit: messages.defaultCommaSpace },
		] as const)(
			"Normalizes $scenario as the same delimiter ','",
			async ({ commit }) => {
				const [actual, error] = scopeDelimiterStyle(
					await parse(commit),
					"always",
				);

				expect(actual).toEqual(true);
				expect(error).toEqual("scope delimiters must be one of [/, \\, ,]");
			},
		);

		test("Fails when a non-default delimiter is used", async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.nonDefaultStar),
				"always",
			);

			expect(actual).toEqual(false);
			expect(error).toEqual("scope delimiters must be one of [/, \\, ,]");
		});
	});

	describe('"never" with default configuration', () => {
		test("Fails when scope uses only default delimiters", async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.defaultSlash),
				"never",
			);

			expect(actual).toEqual(false);
			expect(error).toEqual("scope delimiters must not be one of [/, \\, ,]");
		});

		test("Succeeds when scope uses only non-default delimiter", async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.nonDefaultPipe),
				"never",
			);

			expect(actual).toEqual(true);
			expect(error).toEqual("scope delimiters must not be one of [/, \\, ,]");
		});
	});

	describe("Custom configuration", () => {
		test("Falls back to default delimiters when delimiters is an empty array", async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.defaultComma),
				"always",
				[],
			);

			expect(actual).toEqual(true);
			expect(error).toEqual("scope delimiters must be one of [/, \\, ,]");
		});

		test("Succeeds when a custom single allowed delimiter is used", async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.nonDefaultStar),
				"always",
				["*"],
			);

			expect(actual).toEqual(true);
			expect(error).toEqual("scope delimiters must be one of [*]");
		});

		test("Fails when ',' is used but only '/' is allowed", async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.defaultComma),
				"always",
				["/"],
			);

			expect(actual).toEqual(false);
			expect(error).toEqual("scope delimiters must be one of [/]");
		});

		test("Succeeds when both '/' and '|' are allowed and used in the scope", async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.mixedCustom),
				"always",
				["/", "|"],
			);

			expect(actual).toEqual(true);
			expect(error).toEqual("scope delimiters must be one of [/, |]");
		});

		test('In "never" mode fails when explicitly forbidden delimiter is used', async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.nonDefaultPipe),
				"never",
				["|"],
			);

			expect(actual).toEqual(false);
			expect(error).toEqual("scope delimiters must not be one of [|]");
		});

		test('In "never" mode succeeds when delimiter is not in the forbidden list', async () => {
			const [actual, error] = scopeDelimiterStyle(
				await parse(messages.nonDefaultPipe),
				"never",
				["/"],
			);

			expect(actual).toEqual(true);
			expect(error).toEqual("scope delimiters must not be one of [/]");
		});
	});
});
