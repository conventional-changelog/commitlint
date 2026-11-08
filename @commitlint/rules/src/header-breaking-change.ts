import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const headerBreakingChange: SyncRule = (parsed, when = "never") => {
	const { header } = parsed;
	if (!header) {
		return [true];
	}

	const negated = when === "never";
	const hasBreakingChange = /^BREAKING[ -]CHANGE:/.test(header);

	return [
		negated ? !hasBreakingChange : hasBreakingChange,
		message([
			"header",
			negated ? "must not" : "must",
			negated
				? "start with BREAKING CHANGE; mark breaking changes with ! after the type or a BREAKING CHANGE footer"
				: "start with BREAKING CHANGE",
		]),
	];
};
