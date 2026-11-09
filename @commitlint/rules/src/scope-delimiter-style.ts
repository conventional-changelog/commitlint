import * as ensure from "@commitlint/ensure";
import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const scopeDelimiterStyle: SyncRule<string[]> = ({ scope }, when = "always", value = []) => {
	if (!scope) {
		return [true];
	}

	const delimiters = value.length ? value : ["/", "\\", ","];
	const scopeRawDelimiters = scope.match(/[^\p{L}\p{M}\p{N}_-][^\p{L}\p{N}_-]*/gu) ?? [];
	const scopeDelimiters = [
		...new Set(
			scopeRawDelimiters.map((delimiter) => {
				return delimiter.trim() === "," ? "," : delimiter;
			}),
		),
	];

	const isAllDelimitersAllowed = scopeDelimiters.every((delimiter) => {
		return ensure.enum(delimiter, delimiters);
	});
	const isNever = when === "never";

	return [
		isNever ? !isAllDelimitersAllowed : isAllDelimitersAllowed,
		message([`scope delimiters must ${isNever ? "not " : ""}be one of [${delimiters.join(", ")}]`]),
	];
};
