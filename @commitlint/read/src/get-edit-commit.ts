import toplevel from '@commitlint/top-level';

// Get recently edited commit message
export async function getEditCommit(
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
