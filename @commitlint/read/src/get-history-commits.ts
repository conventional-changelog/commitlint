import type { GitOptions } from "git-raw-commits";
import { getRawCommits } from "git-raw-commits";

// Get commit messages from history
export async function getHistoryCommits(
	options: GitOptions,
	opts: { cwd?: string } = {},
): Promise<string[]> {
	const { skip: skipRaw, ...gitOptions } = options as GitOptions & {
		skip?: unknown;
	};

	let skipNum = 0;
	if (skipRaw !== undefined) {
		skipNum = Number(skipRaw);
		if (!Number.isInteger(skipNum) || skipNum < 0) {
			throw new TypeError(`Invalid skip value: ${skipRaw}`);
		}
	}

	const data: string[] = [];
	for await (const commit of getRawCommits({ ...gitOptions, cwd: opts.cwd })) {
		if (skipNum > 0) {
			skipNum--;
			continue;
		}
		data.push(commit);
	}
	return data;
}
