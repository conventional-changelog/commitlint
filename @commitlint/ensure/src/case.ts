import type { TargetCaseType } from "@commitlint/types";

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

	// Sentence-case and start-case both require at least one word boundary
	// (i.e. more than a single word). Without this check, a single-word input
	// like "CurationFacets" or "Hello" would match sentence-case, because
	// toCase applies upperFirst() which is a no-op for already-capitalized
	// single words — making camelCase indistinguishable from sentence-case.
	// See: https://github.com/conventional-changelog/commitlint/issues/3501
	if (
		(target === "sentence-case" || target === "sentencecase" || target === "start-case") &&
		!input.includes(" ")
	) {
		return false;
	}

	return transformed === input;
}
