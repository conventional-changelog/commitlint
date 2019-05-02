import path from 'path';
import gitRawCommits from 'git-raw-commits';
import * as sander from '@marionebl/sander';

import toplevel from '@commitlint/top-level';

export default getCommitMessages;

// Get commit messages
// Object => Promise<Array<String>>
async function getCommitMessages(settings) {
	const {cwd, from, to, edit} = settings;

	if (edit) {
		return getEditCommit(cwd, edit);
	}

	return getHistoryCommits({from, to}, {cwd});
}

// Get commit messages from history
// Object => Promise<string[]>
function getHistoryCommits(options, opts = {}) {
	return new Promise((resolve, reject) => {
		const data = [];
		gitRawCommits(options, {cwd: opts.cwd})
			.on('data', chunk => data.push(chunk.toString('utf-8')))
			.on('error', reject)
			.on('end', () => {
				resolve(data);
			});
	});
}

// Get recently edited commit message
// (cwd: string, edit: any) => Promise<Array<String>>
async function getEditCommit(cwd, edit) {
	const top = await toplevel(cwd);

	if (typeof top !== 'string') {
		throw new TypeError(`Could not find git root from ${cwd}`);
	}

	const editFilePath = await getEditFilePath(top, edit);

	const editFile = await sander.readFile(editFilePath);
	return [`${editFile.toString('utf-8')}\n`];
}

// Get path to recently edited commit message file
// (top: string, edit: any) => Promise<String>
async function getEditFilePath(top, edit) {
	let editFilePath;
	if (typeof edit === 'string') {
		editFilePath = path.resolve(top, edit);
	} else {
		const dotgitPath = path.join(top, '.git');
		const dotgitStats = sander.lstatSync(dotgitPath);
		if (dotgitStats.isDirectory()) {
			editFilePath = path.join(top, '.git/COMMIT_EDITMSG');
		} else {
			const gitFile = await sander.readFile(dotgitPath, {encoding: 'utf-8'});
			const relativeGitPath = gitFile.replace('gitdir: ', '').replace('\n', '');
			editFilePath = path.resolve(top, relativeGitPath, 'COMMIT_EDITMSG');
		}
	}

	return editFilePath;
}
