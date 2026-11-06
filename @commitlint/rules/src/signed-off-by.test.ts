import { test, expect } from "vitest";
import parse from "@commitlint/parse";
import { signedOffBy } from "./signed-off-by.js";

const messages = {
	empty: "test:\n",
	with: `test: subject\nbody\nfooter\nSigned-off-by:\n\n`,
	without: `test: subject\nbody\nfooter\n\n`,
	inSubject: `test: subject Signed-off-by:\nbody\nfooter\n\n`,
	inBody: `test: subject\nbody Signed-off-by:\nfooter\n\n`,
	withSignoffAndCoAuthor: `test: subject

message body

Signed-off-by: Alice
Co-Authored-By: Someone <some@example.com>
`,
	withSignoffAndProse: `test: subject

message body

Signed-off-by: Alice

some prose
`,
	withSignoffInBodyAndCoAuthor: `test: subject

message body
Signed-off-by: Alice
more prose

Co-Authored-By: Someone <some@example.com>
`,
	withSignoffBeforeWhitespaceLine: `test: subject

message body
Signed-off-by: Alice
 \t
Co-Authored-By: Someone <some@example.com>
`,
	withIndentedSignoff: `test: subject

message body

    Signed-off-by: Alice
`,
	withSignoffAndComments: `test: subject

message body

Signed-off-by:

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
`,

	withSignoffAndCherryPick: `test: subject

message body

Signed-off-by:

(cherry picked from commit 1234567aB)
`,
};

const parsed = {
	empty: parse(messages.empty),
	with: parse(messages.with),
	without: parse(messages.without),
	inSubject: parse(messages.inSubject),
	inBody: parse(messages.inBody),
	withSignoffAndComments: parse(messages.withSignoffAndComments),
	withSignoffAndCherryPick: parse(messages.withSignoffAndCherryPick),
	withSignoffAndCoAuthor: parse(messages.withSignoffAndCoAuthor),
	withSignoffAndProse: parse(messages.withSignoffAndProse),
	withSignoffInBodyAndCoAuthor: parse(messages.withSignoffInBodyAndCoAuthor),
	withSignoffBeforeWhitespaceLine: parse(messages.withSignoffBeforeWhitespaceLine),
	withIndentedSignoff: parse(messages.withIndentedSignoff),
};

test('empty against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.empty, "always", "Signed-off-by:");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('empty against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.empty, "never", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "always signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.with, "always", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('with against "never signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.with, "never", "Signed-off-by:");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.without, "always", "Signed-off-by:");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('without against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.without, "never", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});

test("trailing comments should be ignored", async () => {
	const [actual] = signedOffBy(await parsed.withSignoffAndComments, "always", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('inSubject against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.inSubject, "always", "Signed-off-by:");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('inSubject against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.inSubject, "never", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('inBody against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.inBody, "always", "Signed-off-by:");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('inBody against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.inBody, "never", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});

test("cherry pick marker should be ignored", async () => {
	const [actual] = signedOffBy(await parsed.withSignoffAndCherryPick, "always", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('cherry pick marker with "never signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.withSignoffAndCherryPick, "never", "Signed-off-by:");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('withSignoffAndCoAuthor against "always signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.withSignoffAndCoAuthor, "always", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('withSignoffAndCoAuthor against "never signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.withSignoffAndCoAuthor, "never", "Signed-off-by:");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('withSignoffAndProse against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.withSignoffAndProse, "always", "Signed-off-by:");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('withSignoffAndProse against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.withSignoffAndProse, "never", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});

test('withSignoffInBodyAndCoAuthor against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(
		await parsed.withSignoffInBodyAndCoAuthor,
		"always",
		"Signed-off-by:",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('withSignoffInBodyAndCoAuthor against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(
		await parsed.withSignoffInBodyAndCoAuthor,
		"never",
		"Signed-off-by:",
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('withSignoffBeforeWhitespaceLine against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(
		await parsed.withSignoffBeforeWhitespaceLine,
		"always",
		"Signed-off-by:",
	);
	const expected = false;
	expect(actual).toEqual(expected);
});

test('withSignoffBeforeWhitespaceLine against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(
		await parsed.withSignoffBeforeWhitespaceLine,
		"never",
		"Signed-off-by:",
	);
	const expected = true;
	expect(actual).toEqual(expected);
});

test('withIndentedSignoff against "always signed-off-by" should fail', async () => {
	const [actual] = signedOffBy(await parsed.withIndentedSignoff, "always", "Signed-off-by:");
	const expected = false;
	expect(actual).toEqual(expected);
});

test('withIndentedSignoff against "never signed-off-by" should succeed', async () => {
	const [actual] = signedOffBy(await parsed.withIndentedSignoff, "never", "Signed-off-by:");
	const expected = true;
	expect(actual).toEqual(expected);
});
