import crypto from 'crypto';
import os from 'os';
import path from 'path';

import execa from 'execa';
import * as sander from '@marionebl/sander';

export {bootstrap, clone};

const PKG_ROOT = path.join(__dirname, '..');

async function bootstrap(fixture) {
	const cwd = path.join(os.tmpdir(), rand());

	if (typeof fixture !== 'undefined') {
		await sander.copydir(PKG_ROOT, fixture).to(cwd);
	}

	await execa('git', ['init', cwd]);

	await Promise.all([
		execa('git', ['config', 'user.name', 'ava'], {cwd}),
		execa('git', ['config', 'user.email', 'test@example.com'], {cwd})
	]);

	return cwd;
}

async function clone(source, ...args) {
	const cwd = path.join(os.tmpdir(), rand());
	await execa('git', ['clone', ...args, source, cwd]);
	await execa('git', ['config', 'user.email', 'test@example.com'], {cwd});
	await execa('git', ['config', 'user.name', 'ava'], {cwd});
	return cwd;
}

function rand() {
	return crypto
		.randomBytes(Math.ceil(6))
		.toString('hex')
		.slice(0, 12);
}
