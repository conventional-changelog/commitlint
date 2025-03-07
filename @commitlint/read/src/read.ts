import minimist from 'minimist';
import type {GitOptions} from 'git-raw-commits';

import {getHistoryCommits} from './get-history-commits.js';
import {getEditCommit} from './get-edit-commit.js';

import {x} from 'tinyexec';

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
	const {cwd, fromLastTag, to, last, edit, gitLogArgs} = settings;
	let from = settings.from;

	if (edit) {
		return getEditCommit(cwd, edit);
	}

	if (last) {
		const gitCommandResult = await x(
			'git',
			['log', '-1', '--pretty=format:%B'],
			{nodeOptions: {cwd}},
		);
		let output = gitCommandResult.stdout.trim();
		// strip output of extra quotation marks ("")
		if (output[0] == '"' && output[output.length - 1] == '"')
			output = output.slice(1, -1);
		return [output];
	}

	if (!from && fromLastTag) {
		const output = await x(
			'git',
			[
				'describe',
				'--abbrev=40',
				'--always',
				'--first-parent',
				'--long',
				'--tags',
			],
			{nodeOptions: {cwd}},
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
			const tagSlice = stdout.lastIndexOf('-', stdout.length - 43);

			from = stdout.slice(0, tagSlice);
		}
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
