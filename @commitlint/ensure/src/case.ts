import type { TargetCaseType } from "@commitlint/types";
import { startCase } from "es-toolkit/compat";

import toCase from "./to-case.js";

export default ensureCase;

function ensureCase(raw: string = "", target: TargetCaseType = "lowercase"): boolean {
	// We delete any content together with quotes because he can contains proper names (example `refactor: `Eslint` configuration`).
	// We need trim string because content with quotes can be at the beginning or end of a line
	const input = String(raw)
		.replace(/`.*?`|".*?"|'.*?'/g, "")
		.trim();

	const transformed = toCase(input, target);

	if (transformed === "" || transformed.match(/^\d/)) {
		return true;
	}

	if (target === "start-case") {
		return input.split(" ").every(isStartCaseWord);
	}

	return transformed === input;
}

// Check a single space separated word for start case. startCase() also splits
// words on periods and digits, so version numbers and names such as `1.0.0`,
// `Core.js` or `V2` would never pass. Allow them as long as the part before the
// first period or digit is start case and the rest only holds letters, digits
// and periods.
function isStartCaseWord(word: string): boolean {
	// An empty word comes from consecutive spaces, which startCase() collapses.
	if (word === "") {
		return false;
	}

	if (startCase(word) === word) {
		return true;
	}

	const match = /^(\p{L}*)[\d.][\p{L}\d.]*$/u.exec(word);

	if (!match) {
		return false;
	}

	const [, head] = match;

	return head === "" ? /^\d/.test(word) : startCase(head) === head;
}
