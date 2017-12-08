import path from 'path';
import gitRawCommits from 'git-raw-commits';
import * as sander from '@marionebl/sander';

import toplevel from './library/toplevel';

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

	const editFilePath =
		typeof edit === 'string'
			? path.resolve(top, edit)
			: path.join(top, '.git/COMMIT_EDITMSG');

	const editFile = await sander.readFile(editFilePath);
	return [`${editFile.toString('utf-8')}\n`];
}
