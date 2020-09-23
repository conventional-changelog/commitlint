import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

declare global {
	var tmp: typeof import('tmp');
}

export async function bootstrap(fixture?: string, directory?: string) {
	const tmpDir = tmp.dirSync({
		keep: false,
		unsafeCleanup: true,
	});

	if (typeof fixture !== 'undefined') {
		var packageDir = await pkgDir(directory);
		if (!packageDir) {
			throw new Error(`ENOENT, no such file or directory '${packageDir}'`);
		}

		await fs.copy(path.join(packageDir, fixture), tmpDir.name);
	}

	return tmpDir.name;
}
