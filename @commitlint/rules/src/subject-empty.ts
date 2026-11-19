import * as ensure from "@commitlint/ensure";
import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const subjectEmpty: SyncRule = (parsed, when = "always") => {
	const negated = when === "never";
	const notEmpty = ensure.notEmpty(parsed.subject || "");
	const hint = negated
		? 'add a subject after the type, e.g. "feat(Compiler): add new feature"'
		: 'leave out the subject, e.g. "feat:"';
	return [
		negated ? notEmpty : !notEmpty,
		message(["subject", negated ? "may not" : "must", "be empty"]),
		hint,
	];
};
