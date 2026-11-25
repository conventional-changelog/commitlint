import { GitClient, type GitLogParams } from "@conventional-changelog/git-client";

export type HistoryCommitsOptions = GitLogParams & Record<string, unknown>;

export function normalizePaths(path?: string | string[]): string[] | undefined {
	if (path === undefined) {
		return undefined;
	}
	const paths = (Array.isArray(path) ? path : [path]).filter(
		(value): value is string => typeof value === "string" && value !== "",
	);
	return paths.length > 0 ? paths : undefined;
}

// Get commit messages from history
export async function getHistoryCommits(
	options: HistoryCommitsOptions,
	opts: { cwd?: string } = {},
): Promise<string[]> {
	// Note: @conventional-changelog/git-client doesn't support arbitrary git
	// log arguments. We extract and handle 'skip' manually here to preserve
	// backward compatibility. Other arbitrary arguments passed via gitLogArgs
	// may be silently ignored.
	const { skip: skipRaw, path: pathRaw, ...restOptions } = options;

	let skipNum = 0;
	if (skipRaw !== undefined) {
		skipNum = Number(skipRaw);
		if (!Number.isInteger(skipNum) || skipNum < 0) {
			throw new TypeError(`Invalid skip value: ${skipRaw}`);
		}
	}

	const normalizedPaths = normalizePaths(pathRaw);
	const gitOptions: HistoryCommitsOptions = {
		...restOptions,
		...(normalizedPaths ? { path: normalizedPaths } : {}),
	};

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
