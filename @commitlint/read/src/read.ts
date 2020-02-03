import {getHistoryCommits} from './get-history-commits';
import {getEditCommit} from './get-edit-commit';

interface GetCommitMessageOptions {
	cwd?: string;
	from?: string;
	to?: string;
	edit?: boolean | string;
}

// Get commit messages
export default async function getCommitMessages(
	settings: GetCommitMessageOptions
): Promise<string[]> {
	const {cwd, from, to, edit} = settings;

	if (edit) {
		return getEditCommit(cwd, edit);
	}

	return getHistoryCommits({from, to}, {cwd});
}
