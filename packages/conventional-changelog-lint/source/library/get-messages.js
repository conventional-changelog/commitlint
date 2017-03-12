import {join} from 'path';
import gitRawCommits from 'git-raw-commits';
import gitToplevel from 'git-toplevel';
import {readFile} from 'mz/fs';

export default getCommitMessages;

// Get commit messages
// Object => Promise<Array<String>>
async function getCommitMessages(settings) {
	const {from, to, edit} = settings;

	if (edit) {
		return getEditCommit();
	}

	return await getHistoryCommits({from, to});
}

// Get commit messages from history
// Object => Promise<Array<String>>
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

// Get recently edited commit message
// () => Promise<Array<String>>
async function getEditCommit() {
	const top = await gitToplevel();
	const editFilePath = join(top, '.git/COMMIT_EDITMSG');
	const editFile = await readFile(editFilePath);
	return [`${editFile.toString('utf-8')}\n`];
}
