import * as sander from '@marionebl/sander';
import execa from 'execa';

import * as git from './git';

export {bootstrap};

async function bootstrap(fixture) {
	const cwd = await git.bootstrap(fixture);

	if (await sander.exists(cwd, 'package.json')) {
		await execa('npm', ['install'], {cwd});
	}

	return cwd;
}
