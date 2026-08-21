import { case as ensureCase } from "@commitlint/ensure";
import message from "@commitlint/message";
import { TargetCaseType, SyncRule } from "@commitlint/types";

const negated = (when?: string) => when === "never";

export const scopeCase: SyncRule<
	| TargetCaseType
	| TargetCaseType[]
	| {
			cases: TargetCaseType[];
			delimiters?: string[];
	  }
> = (parsed, when = "always", value = []) => {
	const { scope } = parsed;

	if (!scope) {
		return [true];
	}
	const isObjectBasedConfiguration = !Array.isArray(value) && !(typeof value === "string");

	const checks = (
		isObjectBasedConfiguration ? value.cases : Array.isArray(value) ? value : [value]
	).map((check) => {
		if (typeof check === "string") {
			return {
				when: "always",
				case: check,
			};
		}
		return check;
	});

	const delimiters =
		isObjectBasedConfiguration && value.delimiters?.length ? value.delimiters : ["/", "\\", ","];
	const delimiterPatterns = delimiters.map((delimiter) => {
		return delimiter === "," ? ", ?" : delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	});
	const delimiterRegex = new RegExp(delimiterPatterns.join("|"));
	const scopeSegments = scope.split(delimiterRegex);

	const matches = checks.filter((check) => {
		const r = scopeSegments.every(
			(segment) => delimiterRegex.test(segment) || ensureCase(segment, check.case),
		);

		return negated(check.when) ? !r : r;
	});

	const result = matches.length > 0;

	// A `never` rule fails because a case matched, so report the case(s) that
	// did. An `always` rule fails because none matched, so it keeps reporting
	// every configured case.
	const reported = negated(when) && result ? matches : checks;
	const list = reported.map((c) => c.case).join(", ");

	return [
		negated(when) ? !result : result,
		message([`scope must`, negated(when) ? `not` : null, `be ${list}`]),
	];
};
