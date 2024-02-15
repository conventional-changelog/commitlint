import execa from 'execa';

import * as fix from './fix.js';

export async function bootstrap(fixture?: string, directory?: string) {
	const cwd = await fix.bootstrap(fixture, directory);

	await init(cwd);
	return cwd;
}

export async function clone(
	source: string,
	args: string[],
	directory?: string,
	gitCommand = 'git'
) {
	const cwd = await fix.bootstrap(undefined, directory);

	await execa(gitCommand, ['clone', ...args, source, cwd]);
	await setup(cwd, gitCommand);
	return cwd;
}

export async function init(cwd: string) {
	await execa('git', ['init', cwd]);
	await setup(cwd);
	return cwd;
}

async function setup(cwd: string, gitCommand = 'git') {
	try {
		await execa(gitCommand, ['config', 'user.name', 'ava'], {cwd});
		await execa(gitCommand, ['config', 'user.email', 'test@example.com'], {
			cwd,
		});
		await execa(gitCommand, ['config', 'commit.gpgsign', 'false'], {cwd});
	} catch (err: any) {
		if (typeof err === 'object' && typeof err.message === 'object') {
			console.warn(`git config in ${cwd} failed`, err.message);
		} else {
			console.error('An unknown error occurred setting up the git environment');
		}
	}
}
