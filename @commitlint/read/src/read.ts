import minimist from 'minimist';
import type {GitOptions} from 'git-raw-commits';
import {getHistoryCommits} from './get-history-commits';
import {getEditCommit} from './get-edit-commit';

interface GetCommitMessageOptions {
	cwd?: string;
	from?: string;
	to?: string;
	edit?: boolean | string;
	gitLogArgs?: string;
}

// Get commit messages
export default async function getCommitMessages(
	settings: GetCommitMessageOptions
): Promise<string[]> {
	const {cwd, from, to, edit, gitLogArgs} = settings;

	if (edit) {
		return getEditCommit(cwd, edit);
	}

	let gitOptions: GitOptions = {from, to};
	if (gitLogArgs) {
		gitOptions = {
			...minimist(gitLogArgs.split(' ')),
			from,
			to,
		};
	}

	return getHistoryCommits(gitOptions, {cwd});
}
