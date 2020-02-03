import gitRawCommits from 'git-raw-commits';
import {streamToPromise} from './stream-to-promise';

// Get commit messages from history
export async function getHistoryCommits(
	options: {from?: string; to?: string},
	opts: {cwd?: string} = {}
): Promise<string[]> {
	return streamToPromise(gitRawCommits(options, {cwd: opts.cwd}));
}
