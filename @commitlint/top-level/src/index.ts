import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { realpathSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const execFileAsync = promisify(execFile);

export default toplevel;

/**
 * Find the git root directory using git rev-parse.
 * This correctly handles git worktrees, submodules, and regular repositories.
 */
async function toplevel(cwd?: string): Promise<string | undefined> {
	try {
		const { stdout } = await execFileAsync(
			"git",
			["rev-parse", "--show-toplevel"],
			{
				cwd,
			},
		);

		const topLevel = stdout.trim();
		if (topLevel) {
			// Resolve symlinks and normalize path on Windows to handle short/long path names
			// Git may return long paths while Node.js uses short paths (or vice versa)
			// We need to resolve through the filesystem to ensure consistency
			try {
				// First resolve the path (handles relative paths and normalizes)
				const resolvedPath = resolve(topLevel);
				// Then use realpathSync to resolve symlinks and get canonical path
				// On Windows, this also handles 8.3 short name conversions
				if (existsSync(resolvedPath)) {
					return realpathSync(resolvedPath);
				}
				return resolvedPath;
			} catch {
				return topLevel;
			}
		}

		return undefined;
	} catch {
		return undefined;
	}
}
