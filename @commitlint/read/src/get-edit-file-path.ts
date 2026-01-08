import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// Get path to recently edited commit message file
export async function getEditFilePath(
	top: string,
	edit?: boolean | string,
): Promise<string> {
	if (typeof edit === "string") {
		return path.resolve(top, edit);
	}

	// Use git rev-parse --git-dir to get the correct git directory
	// This handles worktrees, submodules, and regular repositories correctly
	const { stdout } = await execFileAsync("git", ["rev-parse", "--git-dir"], {
		cwd: top,
	});

	const gitDir = stdout.trim();
	return path.resolve(top, gitDir, "COMMIT_EDITMSG");
}
