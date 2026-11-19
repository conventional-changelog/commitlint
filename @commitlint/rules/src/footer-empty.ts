import * as ensure from "@commitlint/ensure";
import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const footerEmpty: SyncRule = (parsed, when = "always") => {
	const negated = when === "never";
	const notEmpty = ensure.notEmpty(parsed.footer || "");
	const hint = negated
		? [
				"add a footer after a blank line below the body",
				'e.g. "feat(compiler): add new feature"',
				'explain what changed and why, e.g. "Closes #123"',
			].join("\n\n")
		: [
				'leave out the footer, e.g. "feat(compiler): add new feature"',
				'explain what changed and why"',
			].join("\n\n");

	return [
		negated ? notEmpty : !notEmpty,
		message(["footer", negated ? "may not" : "must", "be empty"]),
		hint,
	];
};
