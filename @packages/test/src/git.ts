import {x} from 'tinyexec';

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
	gitCommand = 'git',
) {
	const cwd = await fix.bootstrap(undefined, directory);

	await x(gitCommand, ['clone', ...args, source, cwd]);
	await setup(cwd, gitCommand);
	return cwd;
}

export async function init(cwd: string) {
	await x('git', ['init', cwd]);
	await setup(cwd);
	return cwd;
}

async function setup(cwd: string, gitCommand = 'git') {
	try {
		await x(gitCommand, ['config', 'user.name', 'ava'], {
			nodeOptions: {cwd},
		});
		await x(gitCommand, ['config', 'user.email', 'test@example.com'], {
			nodeOptions: {cwd},
		});
		await x(gitCommand, ['config', 'commit.gpgsign', 'false'], {
			nodeOptions: {cwd},
		});
	} catch (err: any) {
		if (typeof err === 'object' && typeof err.message === 'object') {
			console.warn(`git config in ${cwd} failed`, err.message);
		} else {
			console.error('An unknown error occurred setting up the git environment');
		}
	}
}
