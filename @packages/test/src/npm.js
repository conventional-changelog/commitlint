import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import * as sander from '@marionebl/sander';
import execa from 'execa';
import globby from 'globby';
import tar from 'tar-fs';
import packlist from 'npm-packlist';

import * as fix from './fix';
import * as git from './git';

export {bootstrap, getTarballFiles, getPackageFiles};

async function bootstrap(fixture) {
	const cwd = await git.bootstrap(fixture);

	if (await sander.exists(cwd, 'package.json')) {
		await execa('npm', ['install'], {cwd});
	}

	return cwd;
}

async function getTarballFiles({cwd}) {
	const tarballFilename = await execa.stdout('npm', ['pack'], {cwd});
	const tarballFile = path.resolve(cwd, tarballFilename);
	const workDir = await fix.bootstrap();

	try {
		// Extract tarball
		await new Promise((resolve, reject) => {
			fs
				.createReadStream(tarballFile)
				.pipe(zlib.createGunzip())
				.pipe(tar.extract(workDir))
				.once('error', err => reject(err))
				.once('finish', () => resolve());
		});

		// List all files
		return (await globby(['**'], {
			cwd: path.resolve(workDir, 'package'),
			dot: true,
			nodir: true,
			nosort: true
		})).sort();
	} finally {
		sander.rimraf(tarballFile);
		sander.rimraf(workDir);
	}
}

async function getPackageFiles({cwd, npmignore}) {
	return (await packlist({path: cwd}))
		.concat(npmignore ? '.npmignore' : [])
		.sort();
}
