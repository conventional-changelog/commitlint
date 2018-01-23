import path from 'path';
import * as sander from '@marionebl/sander';
import execa from 'execa';
import globby from 'globby';

import * as git from './git';

export {bootstrap, testPackingFiles};

async function bootstrap(fixture) {
	const cwd = await git.bootstrap(fixture);

	if (await sander.exists(cwd, 'package.json')) {
		await execa('npm', ['install'], {cwd});
	}

	return cwd;
}

async function testPackingFiles(t, expectedFiles) {
	let packFile;
	try {
		// Setup temporary npm project
		const cwd = await bootstrap();
		await execa('npm', ['init', '--yes'], {cwd});

		// Install pack file
		packFile = path.resolve(await execa.stdout('npm', ['pack']));
		await execa('npm', ['install', '--no-progress', packFile], {cwd});

		// Assert packing files
		const pkgName = JSON.parse(await sander.readFile('package.json')).name;
		const actualFiles = await globby(['**', '!node_modules'], {
			cwd: path.resolve(cwd, 'node_modules', pkgName),
			dot: true,
			nodir: true,
			nosort: true
		});
		t.deepEqual(actualFiles.sort(), expectedFiles.sort());
	} finally {
		// Cleanup
		if (packFile) {
			sander.unlink(packFile);
		}
	}
}
