import crypto from 'crypto';
import os from 'os';
import path from 'path';

import * as sander from '@marionebl/sander';
import pkgDir from 'pkg-dir';

export {bootstrap};

async function bootstrap(fixture) {
	const cwd = path.join(os.tmpdir(), rand());

	if (typeof fixture !== 'undefined') {
		await sander.copydir(await pkgDir(), fixture).to(cwd);
	}

	return cwd;
}

function rand() {
	return crypto
		.randomBytes(Math.ceil(6))
		.toString('hex')
		.slice(0, 12);
}
