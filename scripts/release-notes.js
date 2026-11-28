#!/usr/bin/env node
// Builds the GitHub release notes from GitHub's generated notes, in the style
// of the earlier hand-written releases: the version heading from the
// changelog, the pull requests sorted into sections by commit type, and
// GitHub's "New Contributors" and "Full Changelog" lines.
//
// Usage:
//   node scripts/release-notes.js <CHANGELOG.md> <generated-notes.md>
//
// The generated notes come from
//   gh api repos/OWNER/REPO/releases/generate-notes -f tag_name=... --jq .body
// Each of their lines reads "* <pull request title> by @author in <url>".

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const SECTIONS = [
	{ title: "Breaking", match: (item) => item.breaking },
	{ title: "Bug Fixes", match: (item) => item.type === "fix" },
	{ title: "Features", match: (item) => item.type === "feat" },
	{ title: "Performance Improvements", match: (item) => item.type === "perf" },
	{ title: "Reverts", match: (item) => item.type === "revert" },
	{ title: "Refactor", match: (item) => item.type === "refactor" },
	{ title: "CI, docs, etc.", match: () => true },
];

const TYPE = /^\* ([a-z]+)(?:\([^)]*\))?(!)?: /;
const BOT_AUTHOR = / by @[\w-]+\[bot\](?: with @\S+)* in https:\/\//;

/** First version heading of the changelog, such as `# [21.3.0](...) (2026-11-28)`. */
export function changelogHeading(changelog) {
	const heading = changelog.split(/\r?\n/).find((line) => /^##? \[[0-9]/.test(line));
	if (!heading) {
		throw new Error("No version heading found in the changelog");
	}
	return heading;
}

function parseItem(line) {
	const [, type, bang] = TYPE.exec(line) ?? [];
	return { line, type, breaking: bang === "!", bot: BOT_AUTHOR.test(line) };
}

export function formatReleaseNotes({ heading, generated }) {
	const lines = generated.trim().split(/\r?\n/);
	const items = [];
	const footer = [];
	let inChanges = false;
	for (const line of lines) {
		if (line === "## What's Changed") {
			inChanges = true;
		} else if (inChanges && line.startsWith("* ")) {
			items.push(parseItem(line));
		} else if (inChanges && line === "") {
			// Blank lines between the list and the footer.
		} else {
			inChanges = false;
			footer.push(line);
		}
	}

	// Dependency updates from Renovate and the release pull request itself.
	const kept = items.filter((item) => !(item.bot && item.type === "chore"));

	const parts = [heading];
	const placed = new Set();
	for (const section of SECTIONS) {
		const matched = kept.filter((item) => !placed.has(item) && section.match(item));
		if (matched.length === 0) continue;
		matched.forEach((item) => placed.add(item));
		parts.push(`### ${section.title}\n\n${matched.map((item) => item.line).join("\n")}`);
	}
	if (footer.length > 0) {
		parts.push(footer.join("\n").trim());
	}
	return `${parts.join("\n\n")}\n`;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
	const [changelogPath, generatedPath] = process.argv.slice(2);
	if (!changelogPath || !generatedPath) {
		console.error("Usage: node scripts/release-notes.js <CHANGELOG.md> <generated-notes.md>");
		process.exit(1);
	}
	process.stdout.write(
		formatReleaseNotes({
			heading: changelogHeading(readFileSync(changelogPath, "utf8")),
			generated: readFileSync(generatedPath, "utf8"),
		}),
	);
}
