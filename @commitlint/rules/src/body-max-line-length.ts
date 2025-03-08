import { maxLineLength } from "@commitlint/ensure";
import { SyncRule } from "@commitlint/types";

export const bodyMaxLineLength: SyncRule<number> = (
	parsed,
	_when = undefined,
	value = 0,
) => {
	const input = parsed.body;

	if (!input) {
		return [true];
	}

	return [
		maxLineLength(input, value),
		`body's lines must not be longer than ${value} characters`,
	];
};
