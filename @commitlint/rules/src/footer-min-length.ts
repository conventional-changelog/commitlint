import { minLength } from "@commitlint/ensure";
import { SyncRule } from "@commitlint/types";

export const footerMinLength: SyncRule<number> = (
	parsed,
	_when = undefined,
	value = 0,
) => {
	if (!parsed.footer) {
		return [true];
	}

	return [
		minLength(parsed.footer, value),
		`footer must not be shorter than ${value} characters`,
	];
};
