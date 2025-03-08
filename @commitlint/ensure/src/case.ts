import type { TargetCaseType } from "@commitlint/types";

import toCase from "./to-case.js";

export default ensureCase;

function ensureCase(
	raw: string = "",
	target: TargetCaseType = "lowercase",
): boolean {
	// We delete any content together with quotes because he can contains proper names (example `refactor: `Eslint` configuration`).
	// We need trim string because content with quotes can be at the beginning or end of a line
	const input = String(raw)
		.replace(/`.*?`|".*?"|'.*?'/g, "")
		.trim();

	const transformed = toCase(input, target);

	if (transformed === "" || transformed.match(/^\d/)) {
		return true;
	}

	return transformed === input;
}
