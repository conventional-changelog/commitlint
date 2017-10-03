import path from 'path';
import exists from 'path-exists';
import gitRawCommits from '@marionebl/git-raw-commits';
import * as sander from '@marionebl/sander';

import toplevel from './library/toplevel';

export default getCommitMessages;

const SHALLOW_MESSAGE = [
	'Could not get git history from shallow clone.',
	'Use git fetch --shallow before linting.',
	'Original issue: https://git.io/vyKMq\n Refer to https://git.io/vyKMv for details.'
].join('\n');

// Get commit messages
// Object => Promise<Array<String>>
async function getCommitMessages(settings) {
	const {cwd, from, to, edit} = settings;

	if (edit) {
		return getEditCommit(cwd);
	}

	if (await isShallow(cwd)) {
		throw new Error(SHALLOW_MESSAGE);
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

// Check if the current repository is shallow
// (cwd: string) => Promise<Boolean>
async function isShallow(cwd) {
	const top = await toplevel(cwd);

	if (typeof top !== 'string') {
		throw new TypeError(`Could not find git root from ${cwd}`);
	}

	const shallow = path.join(top, '.git/shallow');
	return exists(shallow);
}

// Get recently edited commit message
// (cwd: string) => Promise<Array<String>>
async function getEditCommit(cwd) {
	const top = await toplevel(cwd);

	if (typeof top !== 'string') {
		throw new TypeError(`Could not find git root from ${cwd}`);
	}

	const editFilePath = path.join(top, '.git/COMMIT_EDITMSG');
	const editFile = await sander.readFile(editFilePath);
	return [`${editFile.toString('utf-8')}\n`];
}
