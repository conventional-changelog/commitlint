import path from "node:path";

import fs from "node:fs/promises";
import { packageDirectory as pkgDir } from "pkg-dir";
import tmp from "tmp";

export async function bootstrap(fixture?: string, directory?: string) {
	const tmpDir = tmp.dirSync({
		keep: false,
		unsafeCleanup: true,
	});

	if (typeof fixture !== "undefined") {
		const packageDir = await pkgDir({ cwd: directory });
		if (!packageDir) {
			throw new Error(`ENOENT, no such file or directory '${packageDir}'`);
		}

		await fs.cp(path.join(packageDir, fixture), tmpDir.name, {
			recursive: true,
		});
	}

	return tmpDir.name;
}
