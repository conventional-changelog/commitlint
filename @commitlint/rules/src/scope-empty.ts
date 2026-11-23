import * as ensure from "@commitlint/ensure";
import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const scopeEmpty: SyncRule = (parsed, when = "never") => {
	const { header, scope, subject, type } = parsed;
	const negated = when === "always";
	const notEmpty = ensure.notEmpty(scope || "");
	const headerBeforeSubject =
		subject && header?.endsWith(subject) ? header.slice(0, -subject.length).trimEnd() : undefined;
	if (
		negated &&
		!notEmpty &&
		type != null &&
		(headerBeforeSubject?.endsWith(`${type}():`) || headerBeforeSubject?.endsWith(`${type}()!:`))
	) {
		return [false, 'scope must be empty, remove the empty "()"'];
	}
	return [
		negated ? !notEmpty : notEmpty,
		message(["scope", negated ? "must" : "may not", "be empty"]),
	];
};
