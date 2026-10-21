import * as ensure from "@commitlint/ensure";
import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const typeEmpty: SyncRule = (parsed, when = "always") => {
	const negated = when === "never";
	const notEmpty = ensure.notEmpty(parsed.type || "");
	return [
		negated ? notEmpty : !notEmpty,
		message([
			"type",
			negated ? "may not" : "must",
			"be empty",
			negated && !notEmpty ? getHeaderHint(parsed.header) : undefined,
		]),
	];
};

// A header like "feat add" or "feat:add" doesn't parse, so the type ends up
// empty and the error alone doesn't point at the actual mistake
function getHeaderHint(header?: string | null) {
	if (!header) {
		return undefined;
	}

	if (!header.includes(":")) {
		return '(did you forget the ":" after the type?)';
	}

	if (/^\w+(?:\([^)]*\))?!?:\S/.test(header)) {
		return '(did you forget the space after ":"?)';
	}

	return undefined;
}
