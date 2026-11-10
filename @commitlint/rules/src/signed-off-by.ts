import message from "@commitlint/message";
import toLines from "@commitlint/to-lines";
import { SyncRule } from "@commitlint/types";

const CHERRY_PICK_REGEX = /^\(cherry picked from commit [0-9a-f]{7,64}\)$/i;

export const signedOffBy: SyncRule<string> = (parsed, when = "always", value = "") => {
	const lines = toLines(parsed.raw)
		.filter(
			(ln) =>
				// skip comments
				!ln.startsWith("#") &&
				// skip cherry pick commits
				!CHERRY_PICK_REGEX.test(ln.trim()),
		)
		// git counts whitespace-only lines as blank
		.map((ln) => (ln.trim() ? ln : ""));

	// ignore trailing empty lines
	while (lines.length > 0 && !lines[lines.length - 1]) {
		lines.pop();
	}

	// the trailer block is the last paragraph, so other trailers may follow the sign-off
	const trailers = lines.slice(lines.lastIndexOf("") + 1);

	const negated = when === "never";
	const hasSignedOffBy = trailers.some((ln) => ln.startsWith(value));

	return [
		negated ? !hasSignedOffBy : hasSignedOffBy,
		message(["message", negated ? "must not" : "must", "be signed off"]),
	];
};
