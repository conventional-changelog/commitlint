import { describe, expect, test } from "vitest";

import { changelogHeading, formatReleaseNotes } from "./release-notes.js";

const URL = "https://github.com/conventional-changelog/commitlint/pull";
const HEADING = "# [21.3.0](https://example.com/compare/v21.2.4...v21.3.0) (2026-11-28)";

const item = (title, author = "someone", pr = 1) => `* ${title} by @${author} in ${URL}/${pr}`;
const generated = (...items) => `## What's Changed\n${items.join("\n")}\n`;
const notes = (...items) =>
	formatReleaseNotes({ heading: HEADING, generated: generated(...items) });

describe("formatReleaseNotes", () => {
	test("starts with the changelog heading", () => {
		expect(notes(item("fix: a")).split("\n")[0]).toBe(HEADING);
	});

	test.each([
		["fix(rules): a", "Bug Fixes"],
		["feat: a", "Features"],
		["perf(load): a", "Performance Improvements"],
		["revert: a", "Reverts"],
		["refactor: a", "Refactor"],
		["docs: a", "CI, docs, etc."],
		["test(lint): a", "CI, docs, etc."],
		["ci: a", "CI, docs, etc."],
		["build: a", "CI, docs, etc."],
		["chore: a", "CI, docs, etc."],
		["Update README", "CI, docs, etc."],
	])("puts %j under %s", (title, section) => {
		expect(notes(item(title))).toContain(`### ${section}\n\n${item(title)}\n`);
	});

	test("puts breaking changes under Breaking only", () => {
		const breaking = item("feat(cli)!: a");
		expect(notes(breaking)).toBe(`${HEADING}\n\n### Breaking\n\n${breaking}\n`);
	});

	test("orders the sections and leaves out empty ones", () => {
		expect(notes(item("docs: d", "a", 4), item("feat: b", "a", 2), item("fix: a", "a", 1))).toBe(
			[
				HEADING,
				`### Bug Fixes\n\n${item("fix: a", "a", 1)}`,
				`### Features\n\n${item("feat: b", "a", 2)}`,
				`### CI, docs, etc.\n\n${item("docs: d", "a", 4)}\n`,
			].join("\n\n"),
		);
	});

	test("keeps the generated order within a section", () => {
		expect(notes(item("fix: b", "a", 2), item("fix: a", "a", 1))).toContain(
			`${item("fix: b", "a", 2)}\n${item("fix: a", "a", 1)}`,
		);
	});

	test.each([
		["dependency updates", item("chore: update dependency vite to v8", "renovate[bot]")],
		["the release pull request", item("chore(release): v21.3.1", "commitlint-release[bot]")],
	])("drops chores by bots: %s", (_, chore) => {
		expect(notes(chore, item("fix: a"))).not.toContain(chore);
	});

	test("keeps fixes by bots", () => {
		const fix = item("fix: update dependency jsonc to v3", "renovate[bot]");
		expect(notes(fix)).toContain(fix);
	});

	test("keeps chores by people working with a bot", () => {
		const chore = item("chore: a", "escapedcat with @Copilot");
		expect(notes(chore)).toContain(chore);
	});

	test("keeps New Contributors and Full Changelog as generated", () => {
		const footer = [
			"## New Contributors",
			`* @someone made their first contribution in ${URL}/1`,
			"",
			"**Full Changelog**: https://example.com/compare/v21.2.4...v21.3.0",
		].join("\n");
		const result = formatReleaseNotes({
			heading: HEADING,
			generated: `${generated(item("fix: a"))}\n${footer}\n`,
		});
		expect(result).toBe(`${HEADING}\n\n### Bug Fixes\n\n${item("fix: a")}\n\n${footer}\n`);
	});

	test("handles notes without pull requests", () => {
		const footer = "**Full Changelog**: https://example.com/compare/v21.3.0...v21.3.1";
		expect(formatReleaseNotes({ heading: HEADING, generated: `${footer}\n` })).toBe(
			`${HEADING}\n\n${footer}\n`,
		);
	});
});

describe("changelogHeading", () => {
	test.each([
		["minor or major", "# [21.3.0](https://example.com) (2026-11-28)"],
		["patch", "## [21.2.4](https://example.com) (2026-10-18)"],
	])("returns the first version heading of a %s release", (_, heading) => {
		expect(
			changelogHeading(`# Change Log\n\n${heading}\n\n### Bug Fixes\n\n# [21.2.0](x) (y)\n`),
		).toBe(heading);
	});

	test("throws without a version heading", () => {
		expect(() => changelogHeading("# Change Log\n")).toThrow("No version heading");
	});
});
