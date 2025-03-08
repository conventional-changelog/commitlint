import message from "@commitlint/message";
import { SyncRule } from "@commitlint/types";

export const headerTrim: SyncRule = (parsed) => {
	const { header } = parsed;

	if (!header) {
		return [true];
	}

	const startsWithWhiteSpace = header !== header.trimStart();
	const endsWithWhiteSpace = header !== header.trimEnd();

	switch (true) {
		case startsWithWhiteSpace && endsWithWhiteSpace:
			return [
				false,
				message(["header", "must not be surrounded by whitespace"]),
			];

		case startsWithWhiteSpace:
			return [false, message(["header", "must not start with whitespace"])];

		case endsWithWhiteSpace:
			return [false, message(["header", "must not end with whitespace"])];

		default:
			return [true];
	}
};
