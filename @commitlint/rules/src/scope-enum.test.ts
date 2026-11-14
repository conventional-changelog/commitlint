import { describe, test, it, expect } from "vitest";
import parse from "@commitlint/parse";
import { RuleConfigCondition } from "@commitlint/types";

import { scopeEnum } from "./scope-enum.js";

const messagesByScope = {
	single: {
		plain: "foo(bar): baz",
	},
	multiple: {
		multiple: "foo(bar,baz): qux",
		multipleCommaSpace: "foo(bar, baz): qux",
		multipleSlash: "foo(bar/baz): qux",
	},
	none: {
		empty: "foo: baz",
		superfluous: "foo(): baz",
	},
	objectBaseConfiguration: {
		pipeDelimiter: "foo(bar|baz): qux",
		asteriskDelimiter: "foo(bar*baz): qux",
		multipleCustomDelimiters: "foo(bar|baz/qux*xyz): qux",
	},
};

const { single, multiple, none } = messagesByScope;

const messages = Object.values(messagesByScope).reduce<Record<string, string>>(
	(acc, curr) => ({ ...acc, ...curr }),
	{},
);

const conditions: RuleConfigCondition[] = ["always", "never"];

describe("Scope Enum Validation", () => {
	describe.each(conditions)("condition: %s", (condition) => {
		describe("Enum without Scopes", () => {
			test.each(Object.keys(messages))(
				`Succeeds with a %s message and '${condition}'`,
				async (messageType) => {
					const [actual, message] = scopeEnum(await parse(messages[messageType]), condition, []);
					const expected = true;
					expect(actual).toEqual(expected);
					expect(message).toEqual("");
				},
			);
		});

		describe("Messages without Scopes", () => {
			Object.keys(none).forEach((messageType) => {
				const fakeMessage = messages[messageType];

				it(`Succeeds with a '${messageType}' message and '${condition}' with single-scope enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), condition, ["bar"]);
					expect(actual).toBeTruthy();
					expect(message).toBeFalsy();
				});

				it(`Succeeds with a '${messageType}' message  and '${condition}' with multi-scope enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), condition, ["bar", "baz"]);
					expect(actual).toBeTruthy();
					expect(message).toBeFalsy();
				});
			});
		});
	});

	describe("Always", () => {
		describe("Single-Scope Messages", () => {
			Object.keys(single).forEach((messageType) => {
				const fakeMessage = messages[messageType];

				it(`Succeeds with a '${messageType}' message when all message scopes are included in single-scope enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), "always", ["bar"]);
					expect(actual).toBeTruthy();
					expect(message).toEqual("scope must be one of [bar]");
				});

				test(`Succeeds with a '${messageType}' message when all message scopes are included in multi-scope enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), "always", ["bar", "baz"]);
					expect(actual).toBeTruthy();
					expect(message).toEqual("scope must be one of [bar, baz]");
				});

				test(`Fails with a '${messageType}' message when any message scope is not included in enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), "always", ["foo"]);
					expect(actual).toBeFalsy();
					expect(message).toEqual("scope must be one of [foo]");
				});
			});
		});

		describe("Multi-Scope Messages", () => {
			Object.keys(multiple).forEach((messageType) => {
				const fakeMessage = messages[messageType];

				test(`Succeeds with a '${messageType}' message when all message scopes are included in enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), "always", ["bar", "baz"]);
					expect(actual).toBeTruthy();
					expect(message).toEqual("scope must be one of [bar, baz]");
				});

				test(`Fails with a '${messageType}' message when no message scopes are included in enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), "always", ["foo"]);
					expect(actual).toBeFalsy();
					expect(message).toEqual("scope must be one of [foo]");
				});

				it(`Fails with a '${messageType}' message when only some message scopes are included in enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), "always", ["bar"]);
					expect(actual).toBeFalsy();
					expect(message).toEqual("scope must be one of [bar]");
				});
			});

			test(`Succeeds with a 'multipleSlash' message when the scopes are included in enum`, async () => {
				const [actual, message] = scopeEnum(await parse(messages["multipleSlash"]), "always", [
					"bar/baz",
				]);
				expect(actual).toBeTruthy();
				expect(message).toEqual("scope must be one of [bar/baz]");
			});
		});
	});

	describe("Never", () => {
		describe("Messages with Scopes", () => {
			Object.keys({ ...single, ...multiple }).forEach((messageType) => {
				const fakeMessage = messages[messageType];

				test(`Succeeds with a '${messageType}' message when no message scopes are included in enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), "never", ["foo"]);
					expect(actual).toBeTruthy();
					expect(message).toEqual("scope must not be one of [foo]");
				});

				it(`Fails with a '${messageType}' message when any message scope is included in single-scope enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), "never", ["bar"]);
					expect(actual).toBeFalsy();
					expect(message).toEqual("scope must not be one of [bar]");
				});

				test(`Fails with a '${messageType}' message when any message scope is included in multi-scope enum`, async () => {
					const [actual, message] = scopeEnum(await parse(fakeMessage), "never", ["bar", "baz"]);
					expect(actual).toBeFalsy();
					expect(message).toEqual("scope must not be one of [bar, baz]");
				});
			});

			test(`Fails with a 'multipleSlash' message when the scopes are included in enum`, async () => {
				const [actual, message] = scopeEnum(await parse(messages["multipleSlash"]), "never", [
					"bar/baz",
				]);
				expect(actual).toBeFalsy();
				expect(message).toEqual("scope must not be one of [bar/baz]");
			});
		});
	});

	describe("Object-based configuration", () => {
		test("Supports object value with default delimiters (/, \\ or ,)", async () => {
			const [actual, error] = scopeEnum(await parse(messages["multipleCommaSpace"]), "always", {
				scopes: ["bar", "baz"],
			});
			expect(actual).toBe(true);
			expect(error).toEqual("scope must be one of [bar, baz]");
		});

		test("Supports custom single delimiter", async () => {
			const [actual, error] = scopeEnum(await parse(messages["pipeDelimiter"]), "always", {
				scopes: ["bar", "baz"],
				delimiters: ["|"],
			});
			expect(actual).toBe(true);
			expect(error).toEqual("scope must be one of [bar, baz]");
		});

		test("Supports multiple custom delimiters", async () => {
			const [actual, error] = scopeEnum(
				await parse(messages["multipleCustomDelimiters"]),
				"always",
				{
					scopes: ["bar", "baz", "qux", "xyz"],
					delimiters: ["|", "/", "*"],
				},
			);
			expect(actual).toBe(true);
			expect(error).toEqual("scope must be one of [bar, baz, qux, xyz]");
		});

		test("Fails when any scope segment is not in enum with custom delimiter", async () => {
			const [actual, error] = scopeEnum(await parse(messages["pipeDelimiter"]), "always", {
				scopes: ["bar", "qux"],
				delimiters: ["|"],
			});
			expect(actual).toBe(false);
			expect(error).toEqual("scope must be one of [bar, qux]");
		});

		test("Falls back to default delimiters when delimiters is an empty array", async () => {
			const [actual, error] = scopeEnum(await parse(messages["multipleSlash"]), "always", {
				scopes: ["bar", "baz"],
				delimiters: [],
			});
			expect(actual).toBe(true);
			expect(error).toEqual("scope must be one of [bar, baz]");
		});

		test("Uses object value for 'never' with custom delimiter", async () => {
			const [actual, error] = scopeEnum(await parse(messages["pipeDelimiter"]), "never", {
				scopes: ["bar", "baz"],
				delimiters: ["|"],
			});
			expect(actual).toBe(false);
			expect(error).toEqual("scope must not be one of [bar, baz]");
		});

		test("Handles special characters in delimiters", async () => {
			const [actual, error] = scopeEnum(await parse(messages["asteriskDelimiter"]), "always", {
				scopes: ["bar", "baz"],
				delimiters: ["*"],
			});
			expect(actual).toBe(true);
			expect(error).toEqual("scope must be one of [bar, baz]");
		});
	});

	describe("Per-type scopes", () => {
		const value = {
			scopes: ["core", "cli"],
			scopesByType: {
				build: ["npm", "webpack"],
				chore: [],
			},
		};

		test("Succeeds when the scope is listed for the commit type", async () => {
			const [actual, error] = scopeEnum(await parse("build(npm): qux"), "always", value);
			expect(actual).toBe(true);
			expect(error).toEqual("scope must be one of [npm, webpack] for type build");
		});

		test("Fails when the scope is only listed for other types", async () => {
			const [actual, error] = scopeEnum(await parse("build(core): qux"), "always", value);
			expect(actual).toBe(false);
			expect(error).toEqual("scope must be one of [npm, webpack] for type build");
		});

		test("Keeps using scopes for types without a list of their own", async () => {
			const [listed] = scopeEnum(await parse("feat(core): qux"), "always", value);
			const [buildOnly, error] = scopeEnum(await parse("feat(npm): qux"), "always", value);
			const [unrelated] = scopeEnum(await parse("build(core): qux"), "always", value);
			expect(listed).toBe(true);
			expect(buildOnly).toBe(false);
			expect(error).toEqual("scope must be one of [core, cli]");
			expect(unrelated).toBe(false);
		});

		test("Accepts any scope for a type with an empty list", async () => {
			const [actual, error] = scopeEnum(await parse("chore(anything): qux"), "always", value);
			expect(actual).toBe(true);
			expect(error).toEqual("");
		});

		test("Checks every scope segment against the list of the commit type", async () => {
			const [all] = scopeEnum(await parse("build(npm|webpack): qux"), "always", {
				...value,
				delimiters: ["|"],
			});
			const [some] = scopeEnum(await parse("build(npm|core): qux"), "always", {
				...value,
				delimiters: ["|"],
			});
			expect(all).toBe(true);
			expect(some).toBe(false);
		});

		test("Fails for 'never' when the scope is listed for the commit type", async () => {
			const [actual, error] = scopeEnum(await parse("build(npm): qux"), "never", value);
			expect(actual).toBe(false);
			expect(error).toEqual("scope must not be one of [npm, webpack] for type build");
		});

		test("Succeeds for 'never' when the scope is only listed for other types", async () => {
			const [actual, error] = scopeEnum(await parse("build(core): qux"), "never", value);
			expect(actual).toBe(true);
			expect(error).toEqual("scope must not be one of [npm, webpack] for type build");
		});
	});
});
