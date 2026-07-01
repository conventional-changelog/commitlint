import { GitClient, type GitLogParams } from "@conventional-changelog/git-client";

export type HistoryCommitsOptions = GitLogParams & Record<string, unknown>;

// Get commit messages from history
export async function getHistoryCommits(
	options: HistoryCommitsOptions,
	opts: { cwd?: string } = {},
): Promise<string[]> {
	// Note: @conventional-changelog/git-client doesn't support arbitrary git
	// log arguments. We extract and handle 'skip' manually here to preserve
	// backward compatibility. Other arbitrary arguments passed via gitLogArgs
	// may be silently ignored.
	const { skip: skipRaw, ...gitOptions } = options;

	let skipNum = 0;
	if (skipRaw !== undefined) {
		skipNum = Number(skipRaw);
		if (!Number.isInteger(skipNum) || skipNum < 0) {
			throw new TypeError(`Invalid skip value: ${skipRaw}`);
		}
	}

	const client = new GitClient(opts.cwd ?? process.cwd());

	const data: string[] = [];
	for await (const commit of client.getRawCommits(gitOptions)) {
		if (skipNum > 0) {
			skipNum--;
			continue;
		}
		data.push(commit);
	}
	return data;
}
