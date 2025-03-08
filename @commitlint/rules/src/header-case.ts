import { case as ensureCase } from "@commitlint/ensure";
import message from "@commitlint/message";
import { TargetCaseType, SyncRule } from "@commitlint/types";

const negated = (when?: string) => when === "never";

export const headerCase: SyncRule<TargetCaseType | TargetCaseType[]> = (
	parsed,
	when = "always",
	value = [],
) => {
	const { header } = parsed;

	if (typeof header !== "string" || !header.match(/^[a-z]/i)) {
		return [true];
	}

	const checks = (Array.isArray(value) ? value : [value]).map((check) => {
		if (typeof check === "string") {
			return {
				when: "always",
				case: check,
			};
		}
		return check;
	});

	const result = checks.some((check) => {
		const r = ensureCase(header, check.case);
		return negated(check.when) ? !r : r;
	});

	const list = checks.map((c) => c.case).join(", ");

	return [
		negated(when) ? !result : result,
		message([`header must`, negated(when) ? `not` : null, `be ${list}`]),
	];
};
