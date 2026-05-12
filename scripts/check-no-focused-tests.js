#!/usr/bin/env node
// Guards against `it.only` / `describe.only` / `test.only` / `suite.only`
// landing in test files. Replaces the dropped vitest/no-focused-tests rule
// after the migration from eslint to oxlint.
//
// Usage:
//   node scripts/check-no-focused-tests.js [files...]
// With no args, scans all *.test.{ts,js} files under tracked workspaces.
// With args (lint-staged use), only the passed files are inspected.

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const PATTERN = /\b(?:it|describe|test|suite)\.only\s*\(/;
const TEST_FILE = /\.test\.(?:ts|js|cts|mts|cjs|mjs)$/;

function listTrackedTestFiles() {
	const out = execFileSync("git", ["ls-files", "--", "*.test.*"], {
		encoding: "utf8",
	});
	return out.split("\n").filter((f) => f && TEST_FILE.test(f));
}

const args = process.argv.slice(2);
const files = (args.length ? args : listTrackedTestFiles()).filter((f) => TEST_FILE.test(f));

const offenders = [];
for (const file of files) {
	const lines = readFileSync(file, "utf8").split("\n");
	lines.forEach((line, idx) => {
		if (PATTERN.test(line)) {
			offenders.push(`  ${file}:${idx + 1}: ${line.trim()}`);
		}
	});
}

if (offenders.length) {
	console.error("Found focused tests (.only) — remove before committing:\n" + offenders.join("\n"));
	process.exit(1);
}
