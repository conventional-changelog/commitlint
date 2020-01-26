import tmp from 'tmp';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

async function bootstrap(fixture?: string): Promise<string> {
	const tmpDir = tmp.dirSync({
		keep: false,
		unsafeCleanup: true
	});

	if (typeof fixture !== 'undefined') {
		const packageDir = await pkgDir();
		if (!packageDir) {
			throw new Error(`ENOENT, no such file or directory '${packageDir}'`);
		}

		await fs.copy(path.join(packageDir, fixture), tmpDir.name);
	}

	return tmpDir.name;
}

export {bootstrap};
