import tmp from 'tmp';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

export async function bootstrap(fixture?: string, directory?: string) {
	const tmpDir = tmp.dirSync({
		keep: false,
		unsafeCleanup: true
	});

	if (typeof fixture !== 'undefined') {
		const packageDir = await pkgDir(directory);
		if (!packageDir) {
			throw new Error(`ENOENT, no such file or directory '${packageDir}'`);
		}

		await fs.copy(path.join(packageDir, fixture), tmpDir.name);
	}

	return tmpDir.name;
}
