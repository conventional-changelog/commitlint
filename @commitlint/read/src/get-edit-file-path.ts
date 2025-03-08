import path from "node:path";
import { Stats } from "node:fs";
import fs from "fs/promises";

// Get path to recently edited commit message file
export async function getEditFilePath(
	top: string,
	edit?: boolean | string,
): Promise<string> {
	if (typeof edit === "string") {
		return path.resolve(top, edit);
	}

	const dotgitPath = path.join(top, ".git");
	const dotgitStats: Stats = await fs.lstat(dotgitPath);

	if (dotgitStats.isDirectory()) {
		return path.join(top, ".git/COMMIT_EDITMSG");
	}

	const gitFile: string = await fs.readFile(dotgitPath, {
		encoding: "utf-8",
	});
	const relativeGitPath = gitFile.replace("gitdir: ", "").replace("\n", "");
	return path.resolve(top, relativeGitPath, "COMMIT_EDITMSG");
}
