import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { subjectCase } from "./subject-case.js";

const messages = {
	empty: "test:\n",
	numeric: "test: 1.0.0",
	lowercase: "test: subject",
	lowercase_unicode: "test: тема", // Bulgarian for `subject`
	mixedcase: "test: sUbJeCt",
	caseless: "test: 这是一次提交", // Chinese for `this is a commit`
	uppercase: "test: SUBJECT",
	uppercase_unicode: "test: ÛNDERWERP", // Frisian for `SUBJECT`
	camelcase: "test: subJect",
	camelcase_unicode: "test: θέΜα", // Greek for `subJect`
	kebabcase: "test: sub-ject",
	kebabcase_unicode: "test: áb-har", // Irish for `sub-ject`
	pascalcase: "test: SubJect",
	pascalcase_unicode: "test: ТақыРып", // Kazakh for `SubJect`
	snakecase: "test: sub_ject",
	snakecase_unicode: "test: сэ_дэв", // Mongolian for `sub_ject`
	startcase: "test: Sub Ject",
	startcase_unicode: "test: Äm Ne", // Swedish for `Sub Ject`
	sentencecase: "test: Sub ject",
	sentencecase_unicode: "test: Мав зуъ", // Tajik for `Sub ject`
};

const parsed = {
	empty: parse(messages.empty),
	numeric: parse(messages.numeric),
	lowercase: parse(messages.lowercase),
	lowercase_unicode: parse(messages.lowercase_unicode),
	mixedcase: parse(messages.mixedcase),
	caseless: parse(messages.caseless),
	uppercase: parse(messages.uppercase),
	uppercase_unicode: parse(messages.uppercase_unicode),
	camelcase: parse(messages.camelcase),
	camelcase_unicode: parse(messages.camelcase_unicode),
	kebabcase: parse(messages.kebabcase),
	kebabcase_unicode: parse(messages.kebabcase_unicode),
	pascalcase: parse(messages.pascalcase),
	pascalcase_unicode: parse(messages.pascalcase_unicode),
	snakecase: parse(messages.snakecase),
	snakecase_unicode: parse(messages.snakecase_unicode),
	startcase: parse(messages.startcase),
	startcase_unicode: parse(messages.startcase_unicode),
	sentencecase: parse(messages.sentencecase),
	sentencecase_unicode: parse(messages.sentencecase_unicode),
};

test('with empty subject should succeed for "never lowercase"', async () => {
	const [actual] = subjectCase(await parsed.empty, "never", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty subject should succeed for "always lowercase"', async () => {
	const [actual] = subjectCase(await parsed.empty, "always", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty subject should succeed for "never uppercase"', async () => {
	const [actual] = subjectCase(await parsed.empty, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty subject should succeed for "always uppercase"', async () => {
	const [actual] = subjectCase(await parsed.empty, "always", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with lowercase subject should fail for "never lowercase"', async () => {
	const [actual] = subjectCase(await parsed.lowercase, "never", "lowercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with lowercase subject should succeed for "always lowercase"', async () => {
	const [actual] = subjectCase(await parsed.lowercase, "always", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with lowercase unicode subject should fail for "always uppercase"', async () => {
	const [actual] = subjectCase(
		await parsed.lowercase_unicode,
		"always",
		"upper-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase subject should succeed for "never lowercase"', async () => {
	const [actual] = subjectCase(await parsed.mixedcase, "never", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase subject should fail for "always lowercase"', async () => {
	const [actual] = subjectCase(await parsed.mixedcase, "always", "lowercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase subject should succeed for "never uppercase"', async () => {
	const [actual] = subjectCase(await parsed.mixedcase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase subject should fail for "always uppercase"', async () => {
	const [actual] = subjectCase(await parsed.mixedcase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with caseless subject should succeed for "never sentencecase"', async () => {
	const [actual] = subjectCase(await parsed.caseless, "never", "sentence-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with caseless subject should succeed for "never uppercase"', async () => {
	const [actual] = subjectCase(await parsed.caseless, "never", "upper-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with caseless subject should succeed for "always uppercase"', async () => {
	const [actual] = subjectCase(await parsed.caseless, "always", "upper-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with uppercase subject should fail for "never uppercase"', async () => {
	const [actual] = subjectCase(await parsed.uppercase, "never", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with uppercase subject should succeed for "always uppercase"', async () => {
	const [actual] = subjectCase(await parsed.uppercase, "always", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with uppercase unicode subject should fail for "always lowercase"', async () => {
	const [actual] = subjectCase(
		await parsed.uppercase_unicode,
		"always",
		"lower-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase subject should fail for "always uppercase"', async () => {
	const [actual] = subjectCase(await parsed.camelcase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase subject should succeed for "never uppercase"', async () => {
	const [actual] = subjectCase(await parsed.camelcase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with camelcase subject should fail for "always pascalcase"', async () => {
	const [actual] = subjectCase(await parsed.camelcase, "always", "pascal-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase subject should fail for "always kebabcase"', async () => {
	const [actual] = subjectCase(await parsed.camelcase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase subject should fail for "always snakecase"', async () => {
	const [actual] = subjectCase(await parsed.camelcase, "always", "snake-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase subject should succeed for "always camelcase"', async () => {
	const [actual] = subjectCase(await parsed.camelcase, "always", "camel-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with camelcase unicode subject should fail for "always sentencecase"', async () => {
	const [actual] = subjectCase(
		await parsed.camelcase_unicode,
		"always",
		"sentence-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with kebabcase unicode subject should fail for "always camelcase"', async () => {
	const [actual] = subjectCase(
		await parsed.kebabcase_unicode,
		"always",
		"camel-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase subject should fail for "always uppercase"', async () => {
	const [actual] = subjectCase(await parsed.pascalcase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase subject should succeed for "never uppercase"', async () => {
	const [actual] = subjectCase(await parsed.pascalcase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with pascalcase subject should succeed for "always pascalcase"', async () => {
	const [actual] = subjectCase(
		await parsed.pascalcase,
		"always",
		"pascal-case",
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with pascalcase subject should fail for "always kebabcase"', async () => {
	const [actual] = subjectCase(await parsed.pascalcase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase subject should fail for "always snakecase"', async () => {
	const [actual] = subjectCase(await parsed.pascalcase, "always", "snake-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase subject should fail for "always camelcase"', async () => {
	const [actual] = subjectCase(await parsed.pascalcase, "always", "camel-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase unicode subject should fail for "always uppercase"', async () => {
	const [actual] = subjectCase(
		await parsed.pascalcase_unicode,
		"always",
		"upper-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase subject should fail for "always uppercase"', async () => {
	const [actual] = subjectCase(await parsed.snakecase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase subject should succeed for "never uppercase"', async () => {
	const [actual] = subjectCase(await parsed.snakecase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with snakecase subject should fail for "always pascalcase"', async () => {
	const [actual] = subjectCase(await parsed.snakecase, "always", "pascal-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase subject should fail for "always kebabcase"', async () => {
	const [actual] = subjectCase(await parsed.snakecase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase subject should succeed for "always snakecase"', async () => {
	const [actual] = subjectCase(await parsed.snakecase, "always", "snake-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with snakecase subject should fail for "always camelcase"', async () => {
	const [actual] = subjectCase(await parsed.snakecase, "always", "camel-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase unicode subject should fail for "never lowercase"', async () => {
	const [actual] = subjectCase(
		await parsed.snakecase_unicode,
		"never",
		"lower-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase subject should fail for "always uppercase"', async () => {
	const [actual] = subjectCase(await parsed.startcase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase subject should succeed for "never uppercase"', async () => {
	const [actual] = subjectCase(await parsed.startcase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with startcase subject should fail for "always pascalcase"', async () => {
	const [actual] = subjectCase(await parsed.startcase, "always", "pascal-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase subject should fail for "always kebabcase"', async () => {
	const [actual] = subjectCase(await parsed.startcase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase subject should fail for "always snakecase"', async () => {
	const [actual] = subjectCase(await parsed.startcase, "always", "snake-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase subject should fail for "always camelcase"', async () => {
	const [actual] = subjectCase(await parsed.startcase, "always", "camel-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase subject should succeed for "always startcase"', async () => {
	const [actual] = subjectCase(await parsed.startcase, "always", "start-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with startcase unicode subject should fail for "always pascalcase"', async () => {
	const [actual] = subjectCase(
		await parsed.startcase_unicode,
		"always",
		"pascal-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with sentencecase subject should succeed for "always sentence-case"', async () => {
	const [actual] = subjectCase(
		await parsed.sentencecase,
		"always",
		"sentence-case",
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with sentencecase subject should fail for "never sentencecase"', async () => {
	const [actual] = subjectCase(
		await parsed.sentencecase,
		"never",
		"sentence-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with sentencecase subject should fail for "always pascalcase"', async () => {
	const [actual] = subjectCase(
		await parsed.sentencecase,
		"always",
		"pascal-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with sentencecase subject should succeed for "never camelcase"', async () => {
	const [actual] = subjectCase(
		await parsed.sentencecase,
		"never",
		"camel-case",
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with sentencecase unicode subject should fail for "always camelcase"', async () => {
	const [actual] = subjectCase(
		await parsed.sentencecase_unicode,
		"always",
		"camel-case",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('should use expected message with "always"', async () => {
	const [, message] = subjectCase(
		await parsed.uppercase,
		"always",
		"lower-case",
	);
	expect(message).toContain("must be lower-case");
});

test('should use expected message with "never"', async () => {
	const [, message] = subjectCase(
		await parsed.uppercase,
		"never",
		"upper-case",
	);
	expect(message).toContain("must not be upper-case");
});

test('with uppercase scope should succeed for "always [uppercase, lowercase]"', async () => {
	const [actual] = subjectCase(await parsed.uppercase, "always", [
		"uppercase",
		"lowercase",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with lowercase subject should succeed for "always [uppercase, lowercase]"', async () => {
	const [actual] = subjectCase(await parsed.lowercase, "always", [
		"uppercase",
		"lowercase",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase subject should fail for "always [uppercase, lowercase]"', async () => {
	const [actual] = subjectCase(await parsed.mixedcase, "always", [
		"uppercase",
		"lowercase",
	]);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase subject should pass for "always [uppercase, lowercase, camel-case]"', async () => {
	const [actual] = subjectCase(await parsed.mixedcase, "always", [
		"uppercase",
		"lowercase",
		"camel-case",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should pass for "never [uppercase, lowercase]"', async () => {
	const [actual] = subjectCase(await parsed.mixedcase, "never", [
		"uppercase",
		"lowercase",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with uppercase scope should fail for "never [uppercase, lowercase]"', async () => {
	const [actual] = subjectCase(await parsed.uppercase, "never", [
		"uppercase",
		"lowercase",
	]);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with numeric subject should succeed for "never lowercase"', async () => {
	const [actual] = subjectCase(await parsed.numeric, "never", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with numeric subject should succeed for "always lowercase"', async () => {
	const [actual] = subjectCase(await parsed.numeric, "always", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with numeric subject should succeed for "never uppercase"', async () => {
	const [actual] = subjectCase(await parsed.numeric, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with numeric subject should succeed for "always uppercase"', async () => {
	const [actual] = subjectCase(await parsed.numeric, "always", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test("accepts lowercase Cyrillic subjects", async () => {
	const message = "chore(deps): обновлены все зависимости";
	const parsed = await parse(message);
	const [actual] = subjectCase(parsed, "never", [
		"sentence-case",
		"start-case",
		"pascal-case",
		"upper-case",
	]);

	expect(actual).toBe(true);
});

test("rejects uppercase Cyrillic subjects", async () => {
	const message = "chore(deps): ОБНОВЛЕНЫ ВСЕ ЗАВИСИМОСТИ";
	const parsed = await parse(message);
	const [actual] = subjectCase(parsed, "never", [
		"sentence-case",
		"start-case",
		"pascal-case",
		"upper-case",
	]);

	expect(actual).toBe(false);
});

test("accepts lowercase Chinese subjects", async () => {
	const message = "fix(面试): 修复评价功能";
	const parsed = await parse(message);
	const [actual] = subjectCase(parsed, "never", [
		"sentence-case",
		"start-case",
		"pascal-case",
		"upper-case",
	]);

	expect(actual).toBe(true);
});

test("accepts lowercase Arabic subjects", async () => {
	const message = "feat(مميزات): إضافة وظيفة جديدة";
	const parsed = await parse(message);
	const [actual] = subjectCase(parsed, "never", [
		"sentence-case",
		"start-case",
		"pascal-case",
		"upper-case",
	]);

	expect(actual).toBe(true);
});

test("accepts lowercase Hebrew subjects", async () => {
	const message = "fix(תיקון): תיקון בעיה";
	const parsed = await parse(message);
	const [actual] = subjectCase(parsed, "never", [
		"sentence-case",
		"start-case",
		"pascal-case",
		"upper-case",
	]);

	expect(actual).toBe(true);
});

test("accepts mixed Latin and Cyrillic lowercase subjects", async () => {
	const message = "chore(deps): update зависимости";
	const parsed = await parse(message);
	const [actual] = subjectCase(parsed, "never", [
		"sentence-case",
		"start-case",
		"pascal-case",
		"upper-case",
	]);

	expect(actual).toBe(true);
});
