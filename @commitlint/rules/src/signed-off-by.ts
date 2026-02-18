import message from "@commitlint/message";
import toLines from "@commitlint/to-lines";
import { SyncRule } from "@commitlint/types";

const CHERRY_PICK_REGEX = /^\(cherry picked from commit [0-9a-f]{7,64}\)$/i;

export const signedOffBy: SyncRule<string> = (
	parsed,
	when = "always",
	value = "",
) => {
	const lines = toLines(parsed.raw).filter(
		(ln) =>
			// skip comments
			!ln.startsWith("#") &&
			// skip cherry pick commits
			!CHERRY_PICK_REGEX.test(ln.trim()) &&
			// ignore empty lines
			Boolean(ln),
	);

	const last = lines[lines.length - 1];

	const negated = when === "never";
	const hasSignedOffBy =
		// empty commit message
		last ? last.startsWith(value) : false;

	return [
		negated ? !hasSignedOffBy : hasSignedOffBy,
		message(["message", negated ? "must not" : "must", "be signed off"]),
	];
};
