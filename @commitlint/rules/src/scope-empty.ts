import * as ensure from "@commitlint/ensure";
import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const scopeEmpty: SyncRule = (parsed, when = "never") => {
	const negated = when === "always";
	const notEmpty = ensure.notEmpty(parsed.scope || "");
	const hasEmptyScope =
		parsed.type != null &&
		(parsed.header?.startsWith(`${parsed.type}(): `) ||
			parsed.header?.startsWith(`${parsed.type}()!: `));
	return [
		negated ? !notEmpty && !hasEmptyScope : notEmpty,
		message(["scope", negated ? "must" : "may not", "be empty"]),
	];
};
