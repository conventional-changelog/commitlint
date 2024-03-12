import minimist from 'minimist';
import type {GitOptions} from 'git-raw-commits';

import {getHistoryCommits} from './get-history-commits.js';
import {getEditCommit} from './get-edit-commit.js';

import {execa} from 'execa';

interface GetCommitMessageOptions {
	cwd?: string;
	from?: string;
	to?: string;
	last?: boolean;
	edit?: boolean | string;
	gitLogArgs?: string;
}

// Get commit messages
export default async function getCommitMessages(
	settings: GetCommitMessageOptions
): Promise<string[]> {
	const {cwd, from, to, last, edit, gitLogArgs} = settings;

	if (edit) {
		return getEditCommit(cwd, edit);
	}

	if (last) {
		const executeGitCommand = await execa('git', ['log', '-1', '--pretty=%B']);
		return [executeGitCommand.stdout];
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
