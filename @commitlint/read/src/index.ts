import path from 'path';
import {Stats} from 'fs';
import Buffer from 'buffer';
import {Readable} from 'stream';

import toplevel from '@commitlint/top-level';

const gitRawCommits = require('git-raw-commits');
const sander = require('@marionebl/sander');

interface Settings {
	cwd?: string;
	from?: string;
	to?: string;
	edit?: boolean | string;
}

export default getCommitMessages;

// Get commit messages
async function getCommitMessages(settings: Settings): Promise<string[]> {
	const {cwd, from, to, edit} = settings;

	if (edit) {
		return getEditCommit(cwd, edit);
	}

	return getHistoryCommits({from, to}, {cwd});
}

// Get commit messages from history
function getHistoryCommits(
	options: {from?: string; to?: string},
	opts: {cwd?: string} = {}
): Promise<string[]> {
	return new Promise((resolve, reject) => {
		const data: string[] = [];
		(gitRawCommits(options, {cwd: opts.cwd}) as Readable)
			.on('data', chunk => data.push(chunk.toString('utf-8')))
			.on('error', reject)
			.on('end', () => {
				resolve(data);
			});
	});
}

// Get recently edited commit message
async function getEditCommit(
	cwd?: string,
	edit?: boolean | string
): Promise<string[]> {
	const top = await toplevel(cwd);

	if (typeof top !== 'string') {
		throw new TypeError(`Could not find git root from ${cwd}`);
	}

	const editFilePath = await getEditFilePath(top, edit);

	const editFile: Buffer = await sander.readFile(editFilePath);
	return [`${editFile.toString('utf-8')}\n`];
}

// Get path to recently edited commit message file
async function getEditFilePath(
	top: string,
	edit?: boolean | string
): Promise<string> {
	let editFilePath: string;
	if (typeof edit === 'string') {
		editFilePath = path.resolve(top, edit);
	} else {
		const dotgitPath = path.join(top, '.git');
		const dotgitStats: Stats = sander.lstatSync(dotgitPath);
		if (dotgitStats.isDirectory()) {
			editFilePath = path.join(top, '.git/COMMIT_EDITMSG');
		} else {
			const gitFile: string = await sander.readFile(dotgitPath, {
				encoding: 'utf-8'
			});
			const relativeGitPath = gitFile.replace('gitdir: ', '').replace('\n', '');
			editFilePath = path.resolve(top, relativeGitPath, 'COMMIT_EDITMSG');
		}
	}

	return editFilePath;
}
