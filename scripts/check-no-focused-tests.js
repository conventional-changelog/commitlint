#!/usr/bin/env node
// Guards against `it.only` / `describe.only` / `test.only` / `suite.only`
// landing in test files. Replaces the dropped vitest/no-focused-tests rule
// after the migration from eslint to oxlint.
//
// Usage:
//   node scripts/check-no-focused-tests.js [files...]
// With no args, scans all *.test.{ts,js} files under tracked workspaces.
// With args (lint-staged use), only the passed files are inspected.
//
// Matches on whole-file content (so multi-line forms like
//   it
//     .only("x", ...)
// are caught) and tolerates chained variants such as `it.only.each([...])`.

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

// Whole-file regex:
//   - \b(it|describe|test|suite)   the call kind (word-boundary so `wait.only`
//                                  / `commit.only` etc. don't match)
//   - \s*\.\s*only                 allow whitespace/newlines around the dot
//   - \b                           stop at a token boundary so this matches
//                                  `.only(`, `.only.each(`, `.only.skipIf(`,
//                                  etc., but not e.g. `.onlyChildren`
const PATTERN = /\b(?:it|describe|test|suite)\s*\.\s*only\b/g;
const TEST_FILE = /\.test\.(?:ts|js|cts|mts|cjs|mjs)$/;

function listTrackedTestFiles() {
	const out = execFileSync("git", ["ls-files", "--", "*.test.*"], {
		encoding: "utf8",
	});
	return out.split("\n").filter((f) => f && TEST_FILE.test(f));
}

function lineNumberFor(content, offset) {
	let line = 1;
	for (let i = 0; i < offset; i++) {
		if (content.charCodeAt(i) === 10) line++;
	}
	return line;
}

const args = process.argv.slice(2);
const files = (args.length ? args : listTrackedTestFiles()).filter((f) => TEST_FILE.test(f));

const offenders = [];
for (const file of files) {
	const content = readFileSync(file, "utf8");
	for (const match of content.matchAll(PATTERN)) {
		const lineNo = lineNumberFor(content, match.index);
		// Trim the surrounding line for a readable snippet
		const lineStart = content.lastIndexOf("\n", match.index) + 1;
		const lineEnd = content.indexOf("\n", match.index);
		const snippet = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
		offenders.push(`  ${file}:${lineNo}: ${snippet}`);
	}
}

if (offenders.length) {
	console.error("Found focused tests (.only) — remove before committing:\n" + offenders.join("\n"));
	process.exit(1);
}
