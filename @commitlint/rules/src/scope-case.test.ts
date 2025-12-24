import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { scopeCase } from "./scope-case.js";

const messages = {
	empty: "test: subject",
	lowercase: "test(scope): subject",
	mixedcase: "test(sCoPe): subject",
	uppercase: "test(SCOPE): subject",
	camelcase: "test(myScope): subject",
	kebabcase: "test(my-scope): subject",
	pascalcase: "test(MyScope): subject",
	snakecase: "test(my_scope): subject",
	startcase: "test(My Scope): subject",
};

const parsed = {
	empty: parse(messages.empty),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase),
	camelcase: parse(messages.camelcase),
	kebabcase: parse(messages.kebabcase),
	pascalcase: parse(messages.pascalcase),
	snakecase: parse(messages.snakecase),
	startcase: parse(messages.startcase),
};

test('with empty scope should succeed for "never lowercase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "always lowercase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "always", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "never uppercase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "always uppercase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "always", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "never camelcase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "camel-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "always camelcase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "camel-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "never kebabcase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "kebab-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "always kebabcase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "kebab-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "never pascalcase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "pascal-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "always pascalcase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "pascal-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "never snakecase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "snake-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "always snakecase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "snake-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "never startcase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "start-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty scope should succeed for "always startcase"', async () => {
	const [actual] = scopeCase(await parsed.empty, "never", "start-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with lowercase scope should fail for "never lowercase"', async () => {
	const [actual] = scopeCase(await parsed.lowercase, "never", "lowercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with lowercase scope should succeed for "always lowercase"', async () => {
	const [actual] = scopeCase(await parsed.lowercase, "always", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should succeed for "never lowercase"', async () => {
	const [actual] = scopeCase(await parsed.mixedcase, "never", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should fail for "always lowercase"', async () => {
	const [actual] = scopeCase(await parsed.mixedcase, "always", "lowercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should succeed for "never uppercase"', async () => {
	const [actual] = scopeCase(await parsed.mixedcase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with kebabcase scope should succeed for "always lowercase"', async () => {
	const [actual] = scopeCase(await parsed.kebabcase, "always", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with kebabcase scope should fail for "always camelcase"', async () => {
	const [actual] = scopeCase(await parsed.kebabcase, "always", "camel-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with kebabcase scope should fail for "always pascalcase"', async () => {
	const [actual] = scopeCase(await parsed.kebabcase, "always", "pascal-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with kebabcase scope should succeed for "always kebabcase"', async () => {
	const [actual] = scopeCase(await parsed.kebabcase, "always", "kebab-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with snakecase scope should succeed for "always lowercase"', async () => {
	const [actual] = scopeCase(await parsed.snakecase, "always", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with snakecase scope should fail for "always camelcase"', async () => {
	const [actual] = scopeCase(await parsed.snakecase, "always", "camel-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase scope should fail for "always pascalcase"', async () => {
	const [actual] = scopeCase(await parsed.snakecase, "always", "pascal-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase scope should succeed for "always snakecase"', async () => {
	const [actual] = scopeCase(await parsed.snakecase, "always", "snake-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with camelcase scope should fail for "always lowercase"', async () => {
	const [actual] = scopeCase(await parsed.camelcase, "always", "lowercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase scope should succeed for "always camelcase"', async () => {
	const [actual] = scopeCase(await parsed.camelcase, "always", "camel-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with camelcase scope should fail for "always kebabcase"', async () => {
	const [actual] = scopeCase(await parsed.camelcase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase scope should fail for "always pascalcase"', async () => {
	const [actual] = scopeCase(await parsed.camelcase, "always", "pascal-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase scope should fail for "always lowercase"', async () => {
	const [actual] = scopeCase(await parsed.pascalcase, "always", "lowercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase scope should fail for "always kebabcase"', async () => {
	const [actual] = scopeCase(await parsed.pascalcase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase scope should fail for "always camelcase"', async () => {
	const [actual] = scopeCase(await parsed.pascalcase, "always", "camel-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase scope should succeed for "always pascalcase"', async () => {
	const [actual] = scopeCase(await parsed.pascalcase, "always", "pascal-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should fail for "always uppercase"', async () => {
	const [actual] = scopeCase(await parsed.mixedcase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with uppercase scope should fail for "never uppercase"', async () => {
	const [actual] = scopeCase(await parsed.uppercase, "never", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with uppercase scope should succeed for "always uppercase"', async () => {
	const [actual] = scopeCase(await parsed.uppercase, "always", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with uppercase scope should succeed for "always [uppercase, lowercase]"', async () => {
	const [actual] = scopeCase(await parsed.uppercase, "always", [
		"uppercase",
		"lowercase",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with lowercase scope should succeed for "always [uppercase, lowercase]"', async () => {
	const [actual] = scopeCase(await parsed.lowercase, "always", [
		"uppercase",
		"lowercase",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should fail for "always [uppercase, lowercase]"', async () => {
	const [actual] = scopeCase(await parsed.mixedcase, "always", [
		"uppercase",
		"lowercase",
	]);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should pass for "always [uppercase, lowercase, camel-case]"', async () => {
	const [actual] = scopeCase(await parsed.mixedcase, "always", [
		"uppercase",
		"lowercase",
		"camel-case",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should pass for "never [uppercase, lowercase]"', async () => {
	const [actual] = scopeCase(await parsed.mixedcase, "never", [
		"uppercase",
		"lowercase",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with uppercase scope should fail for "never [uppercase, lowercase]"', async () => {
	const [actual] = scopeCase(await parsed.uppercase, "never", [
		"uppercase",
		"lowercase",
	]);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with slash in scope should succeed for "always pascal-case"', async () => {
	const commit = await parse("feat(Modules/Graph): add Pie Chart");
	const [actual] = scopeCase(commit, "always", "pascal-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with slash in subject should succeed for "always sentence case"', async () => {
	const commit = await parse("chore: Update @angular/core");
	const [actual] = scopeCase(commit, "always", "sentencecase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with object-based configuration should use default delimiters", async () => {
	const commit = await parse("feat(scope/my-scope, shared-scope): subject");
	const [actual] = scopeCase(commit, "always", {
		cases: ["kebab-case"],
	});
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with object-based configuration should support custom single delimiter", async () => {
	const commit = await parse("feat(scope|my-scope): subject");
	const [actual] = scopeCase(commit, "always", {
		cases: ["kebab-case"],
		delimiters: ["|"],
	});
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with object-based configuration should support multiple custom delimiters", async () => {
	const commit = await parse(
		"feat(scope|my-scope/shared-scope,common-scope): subject",
	);
	const [actual] = scopeCase(commit, "always", {
		cases: ["kebab-case"],
		delimiters: ["|", "/", ","],
	});
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with object-based configuration should fall back to default delimiters when empty array provided", async () => {
	const commit = await parse("feat(scope/my-scope): subject");
	const [actual] = scopeCase(commit, "always", {
		cases: ["kebab-case"],
		delimiters: [],
	});
	const expected = true;
	expect(actual).toEqual(expected);
});

test("with object-based configuration should handle special delimiters", async () => {
	const commit = await parse("feat(scope*my-scope): subject");
	const [actual] = scopeCase(commit, "always", {
		cases: ["kebab-case"],
		delimiters: ["*"],
	});
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with object-based configuration should respect "never" when custom delimiter is used', async () => {
	const commit = await parse("feat(scope|my-scope): subject");
	const [actual] = scopeCase(commit, "never", {
		cases: ["kebab-case"],
		delimiters: ["|"],
	});
	const expected = false;
	expect(actual).toEqual(expected);
});
