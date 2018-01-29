import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import execa from 'execa';
import readPkg from 'read-pkg';
import * as sander from '@marionebl/sander';
import tar from 'tar-fs';
import values from 'lodash.values';

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

async function getTarballFiles(source) {
	const cwd = await fix.bootstrap(source);
	const tarball = await execa.stdout('npm', ['pack'], {cwd});
	const files = await getArchveFiles(path.join(cwd, tarball));
	return files;
}

function getArchveFiles(filePath) {
	return new Promise((resolve, reject) => {
		const files = [];

		fs
			.createReadStream(filePath)
			.pipe(zlib.createGunzip())
			.pipe(
				tar.extract(path.dirname(filePath), {
					ignore(_, header) {
						files.push(path.relative('package', header.name));
						return true;
					}
				})
			)
			.once('error', err => reject(err))
			.once('finish', () => resolve(files));
	});
}

async function getPackageFiles(source) {
	const pkg = await readPkg(source);

	return {
		main: path.normalize(pkg.main || './index.js'),
		bin: getPkgBinFiles(pkg.bin)
	};
}

function getPkgBinFiles(bin) {
	if (!bin) {
		return [];
	}

	if (typeof bin === 'string') {
		return [path.normalize(bin)];
	}

	if (typeof bin === 'object') {
		return values(bin).map(b => path.normalize(b));
	}
}
