import crypto from 'crypto';
import os from 'os';
import path from 'path';

import * as sander from '@marionebl/sander';
import execa from 'execa';
import pkgDir from 'pkg-dir';

export {bootstrap, clone, init};

async function bootstrap(fixture) {
	const cwd = path.join(os.tmpdir(), rand());

	if (typeof fixture !== 'undefined') {
		const first = fixture.charAt(0);
		const source =
			first === '.' || first === '/' ? [fixture] : [await pkgDir(), fixture];
		await sander.copydir(...source).to(cwd);
	}

	await init(cwd);
	return cwd;
}

async function clone(source, ...args) {
	const cwd = path.join(os.tmpdir(), rand());
	await execa('git', ['clone', ...args, source, cwd]);
	await setup(cwd);
	return cwd;
}

async function init(cwd) {
	await execa('git', ['init', cwd]);
	await setup(cwd);
	return cwd;
}

async function setup(cwd) {
	try {
		await execa('git', ['config', 'user.name', 'ava'], {cwd});
		await execa('git', ['config', 'user.email', 'test@example.com'], {cwd});
		await execa('git', ['config', 'commit.gpgsign', 'false'], {cwd});
	} catch (err) {
		console.warn(`git config in ${cwd} failed`, err.message);
	}
}

function rand() {
	return crypto
		.randomBytes(Math.ceil(6))
		.toString('hex')
		.slice(0, 12);
}
