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
	const isObjectBasedConfiguration =
		!Array.isArray(value) && !(typeof value === "string");

	const checks = (
		isObjectBasedConfiguration
			? value.cases
			: Array.isArray(value)
				? value
				: [value]
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
		isObjectBasedConfiguration && value.delimiters?.length
			? value.delimiters
			: ["/", "\\", ","];
	const delimiterPatterns = delimiters.map((delimiter) => {
		return delimiter === ","
			? ", ?"
			: delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	});
	const delimiterRegex = new RegExp(delimiterPatterns.join("|"));
	const scopeSegments = scope.split(delimiterRegex);

	const result = checks.some((check) => {
		const r = scopeSegments.every(
			(segment) =>
				delimiterRegex.test(segment) || ensureCase(segment, check.case),
		);

		return negated(check.when) ? !r : r;
	});

	const list = checks.map((c) => c.case).join(", ");

	return [
		negated(when) ? !result : result,
		message([`scope must`, negated(when) ? `not` : null, `be ${list}`]),
	];
};
