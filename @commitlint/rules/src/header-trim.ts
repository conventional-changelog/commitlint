import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const headerTrim: SyncRule = (parsed) => {
	const { header } = parsed;

	if (!header) {
		return [true];
	}

	const startsWithWhiteSpace = header.length > header.trimStart().length;
	const endsWithWhiteSpace = header.length > header.trimEnd().length;

	if (startsWithWhiteSpace && endsWithWhiteSpace)
		return [
			false,
			message(["header", "must not be surrounded by whitespace"]),
		];

	if (startsWithWhiteSpace)
		return [false, message(["header", "must not start with whitespace"])];

	if (endsWithWhiteSpace)
		return [false, message(["header", "must not end with whitespace"])];

	return [true];
};
