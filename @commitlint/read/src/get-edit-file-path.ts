import path from "node:path";
import { x } from "tinyexec";

// Get path to recently edited commit message file
export async function getEditFilePath(top: string, edit?: boolean | string): Promise<string> {
	if (typeof edit === "string") {
		return path.resolve(top, edit);
	}

	const result = await x("git", ["rev-parse", "--git-path", "COMMIT_EDITMSG"], {
		nodeOptions: { cwd: top },
		throwOnError: true,
	});

	return path.resolve(top, result.stdout.trim());
}
