import toplevel from "@commitlint/top-level";
import fs from "fs/promises";

import { getEditFilePath } from "./get-edit-file-path.js";

// Get recently edited commit message
export async function getEditCommit(cwd?: string, edit?: boolean | string): Promise<string[]> {
	const top = await toplevel(cwd);

	if (typeof top !== "string") {
		throw new TypeError(`Could not find git root from ${cwd}`);
	}

	const editFilePath = await getEditFilePath(top, edit);

	let editFile: Buffer;
	try {
		editFile = await fs.readFile(editFilePath);
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === "ENOENT") {
			const hint =
				typeof edit === "string"
					? `Check that the path passed to --edit exists and is readable.`
					: `--edit reads the message prepared by 'git commit' and is intended to run from a commit-msg hook. If you want to lint existing history, use --from / --to instead; to lint a specific file, pass its path as --edit <file>.`;
			throw new Error(
				`No commit message file found at ${editFilePath}. ${hint}`,
				{ cause: err },
			);
		}
		throw err;
	}

	return [`${editFile.toString("utf-8")}\n`];
}
