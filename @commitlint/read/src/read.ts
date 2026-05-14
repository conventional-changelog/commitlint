import { parseArgs } from "node:util";
import type { GitOptions } from "git-raw-commits";

import { getHistoryCommits } from "./get-history-commits.js";
import { getEditCommit } from "./get-edit-commit.js";

import { x } from "tinyexec";

interface GetCommitMessageOptions {
	cwd?: string;
	from?: string;
	fromLastTag?: boolean;
	to?: string;
	last?: boolean;
	edit?: boolean | string;
	gitLogArgs?: string;
}

// Get commit messages
export default async function getCommitMessages(
	settings: GetCommitMessageOptions,
): Promise<string[]> {
	const { cwd, fromLastTag, to, last, edit, gitLogArgs } = settings;
	let from = settings.from;

	if (edit) {
		return getEditCommit(cwd, edit);
	}

	if (last) {
		const gitCommandResult = await x("git", ["log", "-1", "--pretty=format:%B"], {
			nodeOptions: { cwd },
		});
		let output = gitCommandResult.stdout.trim();
		// strip output of extra quotation marks ("")
		if (output[0] == '"' && output[output.length - 1] == '"') output = output.slice(1, -1);
		return [output];
	}

	if (!from && fromLastTag) {
		const output = await x(
			"git",
			["describe", "--abbrev=40", "--always", "--first-parent", "--long", "--tags"],
			{ nodeOptions: { cwd } },
		);
		const stdout = output.stdout.trim();

		if (stdout.length === 40) {
			// Hash only means no last tag. Use that as the from ref which
			// results in a no-op.
			from = stdout;
		} else {
			// Description will be in the format: <tag>-<count>-g<hash>
			// Example: v3.2.0-11-g9057371a52adaae5180d93fe4d0bb808d874b9fb
			// Minus zero based (1), dash (1), "g" prefix (1), hash (40) = -43
			const tagSlice = stdout.lastIndexOf("-", stdout.length - 43);

			from = stdout.slice(0, tagSlice);
		}
	}

	// Verify the two refs share a merge-base before handing off the range
	// walk to git-raw-commits. In a shallow clone the common ancestor may
	// be missing, in which case `git log from..to` silently returns only
	// the commits that happen to be present, hiding invalid commits in the
	// unfetched portion of history.
	if (from) {
		// `to` is left undefined here when no --to was given; git-raw-commits
		// defaults it to HEAD, so we mirror that for the merge-base check.
		const effectiveTo = to ?? "HEAD";
		const mergeBase = await x("git", ["merge-base", from, effectiveTo], {
			nodeOptions: { cwd },
		});
		if (mergeBase.exitCode === 1) {
			throw new Error(
				`Cannot find merge-base between '${from}' and '${effectiveTo}'. ` +
					`This typically indicates incomplete git history (e.g., a shallow clone). ` +
					`Consider fetching more history.`,
			);
		}
	}

	let gitOptions: GitOptions = { from, to };
	if (gitLogArgs) {
		const { values, positionals } = parseArgs({
			args: gitLogArgs.split(" "),
			strict: false,
		});
		gitOptions = {
			...values,
			_: positionals,
			from,
			to,
		};
	}

	return getHistoryCommits(gitOptions, { cwd });
}
