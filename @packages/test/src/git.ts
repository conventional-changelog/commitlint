import execa from 'execa';

import * as fix from './fix';

export async function bootstrap(fixture?: string) {
	const cwd = await fix.bootstrap(fixture);

	await init(cwd);
	return cwd;
}

export async function clone(source: string, ...args: string[]) {
	const cwd = await fix.bootstrap();

	await execa('git', ['clone', ...args, source, cwd]);
	await setup(cwd);
	return cwd;
}

export async function init(cwd: string) {
	await execa('git', ['init', cwd]);
	await setup(cwd);
	return cwd;
}

async function setup(cwd: string) {
	try {
		await execa('git', ['config', 'user.name', 'ava'], {cwd});
		await execa('git', ['config', 'user.email', 'test@example.com'], {cwd});
		await execa('git', ['config', 'commit.gpgsign', 'false'], {cwd});
	} catch (err) {
		console.warn(`git config in ${cwd} failed`, err.message);
	}
}
