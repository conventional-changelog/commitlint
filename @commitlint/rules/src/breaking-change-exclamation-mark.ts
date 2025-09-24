import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const breakingChangeExclamationMark: SyncRule = (
	parsed,
	when = "always",
) => {
	const header = parsed.header;
	const footer = parsed.footer;

	// It is the correct behavior to return true only when both the header and footer are empty,
	// but still run the usual checks if one or neither are empty.
	// The reasoning is that if one is empty and the other contains a breaking change marker,
	// then the check fails as it is not possible for the empty one to indicate a breaking change.
	if (!header && !footer) {
		return [true];
	}

	const hasExclamationMark = !!header && /!:/.test(header);
	const hasBreakingChange = !!footer && /BREAKING[ -]CHANGE:/.test(footer);

	const negated = when === "never";
	const check = hasExclamationMark === hasBreakingChange;

	return [
		negated ? !check : check,
		message([
			"breaking changes",
			negated ? "must not" : "must",
			"have both an exclamation mark in the header",
			"and BREAKING CHANGE in the footer",
			"to identify a breaking change",
		]),
	];
};
