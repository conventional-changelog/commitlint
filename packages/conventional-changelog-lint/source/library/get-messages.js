// core modules
import {
	readFile as readFileNodeback
} from 'fs';

import denodeify from 'denodeify';
import gitRawCommits from 'git-raw-commits';

const readFile = denodeify(readFileNodeback);

// Get commit messages
function getCommits(options) {
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

// Get commit messages
export default async settings => {
	const {from, to, edit} = settings;

	if (edit) {
		const editFile = await readFile(`.git/COMMIT_EDITMSG`);
		return [editFile.toString('utf-8')];
	} else {
		return await getCommits({
			from,
			to
		});
	}
}
