import type { GitOptions } from "git-raw-commits";
import { getRawCommits } from "git-raw-commits";

// Get commit messages from history
export async function getHistoryCommits(
	options: GitOptions,
	opts: { cwd?: string } = {},
): Promise<string[]> {
	const { skip, ...gitOptions } = options as GitOptions & { skip?: number };
	const data: string[] = [];
	for await (const commit of getRawCommits({ ...gitOptions, cwd: opts.cwd })) {
		data.push(commit);
	}
	if (skip) {
		return data.slice(skip);
	}
	return data;
}
