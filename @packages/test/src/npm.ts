import path from "node:path";
import { createRequire } from "node:module";

import fs from "fs-extra";
import resolvePkg from "resolve-pkg";

import * as git from "./git.js";

const require = createRequire(import.meta.url);

export async function installModules(cwd: string) {
	const manifestPath = path.join(cwd, "package.json");
	const targetModulesPath = path.join(cwd, "node_modules");

	if (await fs.pathExists(manifestPath)) {
		const { dependencies = {}, devDependencies = {} } =
			await fs.readJson(manifestPath);
		const deps = Object.keys({ ...dependencies, ...devDependencies });
		await Promise.all(
			deps.map(async (dependency: any) => {
				let sourcePath = resolvePkg(dependency);

				if (!sourcePath) {
					try {
						const entry = require.resolve(dependency);
						const sourceModulesPath = findParentPath(entry, "node_modules");
						if (sourceModulesPath) {
							const rel = path.relative(sourceModulesPath, entry);
							const segments = rel.split(path.sep);
							if (segments[0].startsWith("@")) {
								sourcePath = path.join(
									sourceModulesPath,
									segments[0],
									segments[1],
								);
							} else {
								sourcePath = path.join(sourceModulesPath, segments[0]);
							}
						}
					} catch (e) {
						// Ignore
					}
				}

				if (!sourcePath) {
					throw new Error(`Could not resolve dependency ${dependency}`);
				}

				const sourceModulesPath = findParentPath(sourcePath, "node_modules");

				if (!sourceModulesPath) {
					throw new Error(`Could not determine node_modules for ${sourcePath}`);
				}

				const relativePath = path.relative(sourceModulesPath, sourcePath);
				const targetPath = path.join(targetModulesPath, relativePath);

				await fs.mkdirp(path.join(targetPath, ".."));
				await fs.symlink(sourcePath, targetPath);
			}),
		);
	}
}

export async function bootstrap(fixture: string, directory?: string) {
	const cwd = await git.bootstrap(fixture, directory);
	await installModules(cwd);
	return cwd;
}

function findParentPath(
	parentPath: string,
	dirname: string,
): string | undefined {
	const rawFragments = parentPath.split(path.sep);

	const { matched, fragments } = rawFragments.reduceRight(
		({ fragments, matched }, item) => {
			if (item === dirname && !matched) {
				return { fragments, matched: true };
			}

			if (!matched && fragments.length > 0) {
				fragments.pop();
			}

			return { fragments, matched };
		},
		{ fragments: rawFragments, matched: false },
	);

	return matched ? fragments.join(path.sep) : undefined;
}
