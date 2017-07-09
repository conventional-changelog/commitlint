import {join} from 'path';
import exists from 'path-exists';
import gitRawCommits from 'git-raw-commits';
import gitToplevel from 'git-toplevel';
import {readFile} from 'mz/fs';

export default getCommitMessages;

const SHALLOW_MESSAGE = [
	'Could not get git history from shallow clone.',
	'Use git fetch --shallow before linting.',
	'Original issue: https://git.io/vyKMq\n Refer to https://git.io/vyKMv for details.'
].join('\n');

// Get commit messages
// Object => Promise<Array<String>>
async function getCommitMessages(settings) {
	const {from, to, edit} = settings;

	if (edit) {
		return getEditCommit();
	}

	if (await isShallow()) {
		throw new Error(SHALLOW_MESSAGE);
	}

	return getHistoryCommits({from, to});
}

// Get commit messages from history
// Object => Promise<string[]>
function getHistoryCommits(options) {
	return new Promise((resolve, reject) => {
		const data = [];
		gitRawCommits(options)
		.on('data', chunk => data.push(chunk.toString('utf-8')))
		.on('error', reject)
		.on('end', () => {
			resolve(data);
		});
	});
}

// Check if the current repository is shallow
// () => Promise<Boolean>
async function isShallow() {
	const top = await gitToplevel();
	const shallow = join(top, '.git/shallow');
	return exists(shallow);
}

// Get recently edited commit message
// () => Promise<Array<String>>
async function getEditCommit() {
	const top = await gitToplevel();
	const editFilePath = join(top, '.git/COMMIT_EDITMSG');
	const editFile = await readFile(editFilePath);
	return [`${editFile.toString('utf-8')}\n`];
}
