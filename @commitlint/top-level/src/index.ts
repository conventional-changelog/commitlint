import path from 'path';
import up from 'find-up';

declare module 'find-up' {
	interface Options {
		cwd?: string;
		type?: 'file' | 'directory';
	}
}

export default toplevel;

/**
 * Find the next git root
 */
async function toplevel(cwd?: string) {
	const found = await searchDotGit(cwd);

	if (typeof found !== 'string') {
		return found;
	}

	return path.join(found, '..');
}

/**
 * Search .git, the '.git' can be a file(submodule), also can be a directory(normal)
 */
async function searchDotGit(cwd?: string) {
	const foundFile = await up('.git', {cwd, type: 'file'});
	const foundDir = await up('.git', {cwd, type: 'directory'});

	return foundFile || foundDir;
}
