import path from 'path';
import {Stats} from 'fs';

const sander = require('@marionebl/sander');

// Get path to recently edited commit message file
export async function getEditFilePath(
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
