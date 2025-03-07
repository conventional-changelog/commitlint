import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { typeCase } from "./type-case.js";

const messages = {
	empty: "(scope): subject",
	lowercase: "type: subject",
	mixedcase: "tYpE: subject",
	uppercase: "TYPE: subject",
	camelcase: "tyPe: subject",
	pascalcase: "TyPe: subject",
	snakecase: "ty_pe: subject",
	kebabcase: "ty-pe: subject",
	startcase: "Ty Pe: subject",
};

const parsed = {
	empty: parse(messages.empty),
	lowercase: parse(messages.lowercase),
	mixedcase: parse(messages.mixedcase),
	uppercase: parse(messages.uppercase),
	camelcase: parse(messages.camelcase),
	pascalcase: parse(messages.pascalcase),
	snakecase: parse(messages.snakecase),
	kebabcase: parse(messages.kebabcase),
	startcase: parse(messages.startcase, undefined, {
		headerPattern: /^(.*): (.*)$/,
		headerCorrespondence: ["type", "subject"],
	}),
};

test('with empty type should succeed for "never lowercase"', async () => {
	const [actual] = typeCase(await parsed.empty, "never", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty type should succeed for "always lowercase"', async () => {
	const [actual] = typeCase(await parsed.empty, "always", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty type should succeed for "never uppercase"', async () => {
	const [actual] = typeCase(await parsed.empty, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with empty type should succeed for "always uppercase"', async () => {
	const [actual] = typeCase(await parsed.empty, "always", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with lowercase type should fail for "never lowercase"', async () => {
	const [actual] = typeCase(await parsed.lowercase, "never", "lowercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with lowercase type should succeed for "always lowercase"', async () => {
	const [actual] = typeCase(await parsed.lowercase, "always", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase type should succeed for "never lowercase"', async () => {
	const [actual] = typeCase(await parsed.mixedcase, "never", "lowercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase type should fail for "always lowercase"', async () => {
	const [actual] = typeCase(await parsed.mixedcase, "always", "lowercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase type should succeed for "never uppercase"', async () => {
	const [actual] = typeCase(await parsed.mixedcase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase type should fail for "always uppercase"', async () => {
	const [actual] = typeCase(await parsed.mixedcase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with uppercase type should fail for "never uppercase"', async () => {
	const [actual] = typeCase(await parsed.uppercase, "never", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with lowercase type should succeed for "always uppercase"', async () => {
	const [actual] = typeCase(await parsed.uppercase, "always", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with camelcase type should fail for "always uppercase"', async () => {
	const [actual] = typeCase(await parsed.camelcase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase type should succeed for "never uppercase"', async () => {
	const [actual] = typeCase(await parsed.camelcase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with camelcase type should fail for "always pascalcase"', async () => {
	const [actual] = typeCase(await parsed.camelcase, "always", "pascal-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase type should fail for "always kebabcase"', async () => {
	const [actual] = typeCase(await parsed.camelcase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase type should fail for "always snakecase"', async () => {
	const [actual] = typeCase(await parsed.camelcase, "always", "snake-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase type should fail for "always startcase"', async () => {
	const [actual] = typeCase(await parsed.camelcase, "always", "start-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with camelcase type should succeed for "always camelcase"', async () => {
	const [actual] = typeCase(await parsed.camelcase, "always", "camel-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with pascalcase type should fail for "always uppercase"', async () => {
	const [actual] = typeCase(await parsed.pascalcase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase type should succeed for "never uppercase"', async () => {
	const [actual] = typeCase(await parsed.pascalcase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with pascalcase type should fail for "always camelcase"', async () => {
	const [actual] = typeCase(await parsed.pascalcase, "always", "camel-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase type should fail for "always kebabcase"', async () => {
	const [actual] = typeCase(await parsed.pascalcase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase type should fail for "always snakecase"', async () => {
	const [actual] = typeCase(await parsed.pascalcase, "always", "snake-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase type should fail for "always startcase"', async () => {
	const [actual] = typeCase(await parsed.pascalcase, "always", "start-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with pascalcase type should succeed for "always pascalcase"', async () => {
	const [actual] = typeCase(await parsed.pascalcase, "always", "pascal-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with snakecase type should fail for "always uppercase"', async () => {
	const [actual] = typeCase(await parsed.snakecase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase type should succeed for "never uppercase"', async () => {
	const [actual] = typeCase(await parsed.snakecase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with snakecase type should fail for "always camelcase"', async () => {
	const [actual] = typeCase(await parsed.snakecase, "always", "camel-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase type should fail for "always kebabcase"', async () => {
	const [actual] = typeCase(await parsed.snakecase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase type should succeed for "always snakecase"', async () => {
	const [actual] = typeCase(await parsed.snakecase, "always", "snake-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with snakecase type should fail for "always pascalcase"', async () => {
	const [actual] = typeCase(await parsed.snakecase, "always", "pascal-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with snakecase type should fail for "always start case"', async () => {
	const [actual] = typeCase(await parsed.snakecase, "always", "start-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase type should fail for "always uppercase"', async () => {
	const [actual] = typeCase(await parsed.startcase, "always", "uppercase");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase type should succeed for "never uppercase"', async () => {
	const [actual] = typeCase(await parsed.startcase, "never", "uppercase");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with startcase type should fail for "always camelcase"', async () => {
	const [actual] = typeCase(await parsed.startcase, "always", "camel-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase type should fail for "always kebabcase"', async () => {
	const [actual] = typeCase(await parsed.startcase, "always", "kebab-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase type should fail for "always snakecase"', async () => {
	const [actual] = typeCase(await parsed.startcase, "always", "snake-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase type should fail for "always pascalcase"', async () => {
	const [actual] = typeCase(await parsed.startcase, "always", "pascal-case");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with startcase type should succeed for "always startcase"', async () => {
	const [actual] = typeCase(await parsed.startcase, "always", "start-case");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with uppercase scope should succeed for "always [uppercase, lowercase]"', async () => {
	const [actual] = typeCase(await parsed.uppercase, "always", [
		"uppercase",
		"lowercase",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with lowercase subject should succeed for "always [uppercase, lowercase]"', async () => {
	const [actual] = typeCase(await parsed.lowercase, "always", [
		"uppercase",
		"lowercase",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase subject should fail for "always [uppercase, lowercase]"', async () => {
	const [actual] = typeCase(await parsed.mixedcase, "always", [
		"uppercase",
		"lowercase",
	]);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('with mixedcase subject should pass for "always [uppercase, lowercase, camel-case]"', async () => {
	const [actual] = typeCase(await parsed.mixedcase, "always", [
		"uppercase",
		"lowercase",
		"camel-case",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with mixedcase scope should pass for "never [uppercase, lowercase]"', async () => {
	const [actual] = typeCase(await parsed.mixedcase, "never", [
		"uppercase",
		"lowercase",
	]);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with uppercase scope should fail for "never [uppercase, lowercase]"', async () => {
	const [actual] = typeCase(await parsed.uppercase, "never", [
		"uppercase",
		"lowercase",
	]);
	const expected = false;
	expect(actual).toEqual(expected);
});
