import * as ensure from "@commitlint/ensure";
import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const scopeEmpty: SyncRule = (parsed, when = "never") => {
	const negated = when === "always";
	const notEmpty = ensure.notEmpty(parsed.scope || "");
	const hint = !negated
		? 'add a scope after the type, e.g. "feat(app): add new feature "'
		: 'leave out the scope, e.g. "feat:"';
	return [
		negated ? !notEmpty : notEmpty,
		message(["scope", negated ? "must" : "may not", "be empty"]),
		hint,
	];
};
