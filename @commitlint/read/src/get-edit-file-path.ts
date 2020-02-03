import path from 'path';
import {Stats} from 'fs';

const sander = require('@marionebl/sander');

// Get path to recently edited commit message file
export async function getEditFilePath(
	top: string,
	edit?: boolean | string
): Promise<string> {
	if (typeof edit === 'string') {
		return path.resolve(top, edit);
	}

	const dotgitPath = path.join(top, '.git');
	const dotgitStats: Stats = sander.lstatSync(dotgitPath);

	if (dotgitStats.isDirectory()) {
		return path.join(top, '.git/COMMIT_EDITMSG');
	}

	const gitFile: string = await sander.readFile(dotgitPath, {
		encoding: 'utf-8'
	});
	const relativeGitPath = gitFile.replace('gitdir: ', '').replace('\n', '');
	return path.resolve(top, relativeGitPath, 'COMMIT_EDITMSG');
}
