import path from "node:path";
import { createRequire } from "node:module";
import { existsSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

import fs from "node:fs/promises";
import resolvePkg from "resolve-pkg";

import * as git from "./git.js";

const require = createRequire(import.meta.url);

/**
 * Pure-ESM packages (e.g. conventional-changelog-angular@>=9,
 * conventional-changelog-conventionalcommits@>=10) ship an `exports` map with
 * only the `import` condition, which the CommonJS resolvers (`resolve-pkg`,
 * `require.resolve`) cannot read. Locate the package directory by walking up
 * from this module and checking both the regular and the pnpm-virtual-store
 * (`node_modules/.pnpm/node_modules/<name>`) layouts.
 */
function resolveModuleDir(dependency: string): string | undefined {
	let dir = path.dirname(fileURLToPath(import.meta.url));
	for (;;) {
		for (const rel of [
			path.join("node_modules", dependency),
			path.join("node_modules", ".pnpm", "node_modules", dependency),
		]) {
			const candidate = path.join(dir, rel);
			if (existsSync(path.join(candidate, "package.json"))) {
				return realpathSync(candidate);
			}
		}
		const parent = path.dirname(dir);
		if (parent === dir) {
			return undefined;
		}
		dir = parent;
	}
}

export async function installModules(cwd: string) {
	const manifestPath = path.join(cwd, "package.json");
	const targetModulesPath = path.join(cwd, "node_modules");

	if (
		await fs
			.access(manifestPath)
			.then(() => true)
			.catch(() => false)
	) {
		const { dependencies = {}, devDependencies = {} } = JSON.parse(
			await fs.readFile(manifestPath, "utf-8"),
		);
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
								sourcePath = path.join(sourceModulesPath, segments[0], segments[1]);
							} else {
								sourcePath = path.join(sourceModulesPath, segments[0]);
							}
						}
					} catch (e: unknown) {
						// Only silently ignore expected MODULE_NOT_FOUND errors
						if (
							e &&
							typeof e === "object" &&
							"code" in e &&
							(e as any).code === "MODULE_NOT_FOUND"
						) {
							// Expected: package not found via require.resolve
						} else {
							console.warn("Unexpected error while resolving dependency:", dependency, e);
						}
					}
				}

				if (!sourcePath) {
					sourcePath = resolveModuleDir(dependency);
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

				await fs.mkdir(path.join(targetPath, ".."), { recursive: true });
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

function findParentPath(parentPath: string, dirname: string): string | undefined {
	const parts = parentPath.split(path.sep);
	const idx = parts.lastIndexOf(dirname);
	if (idx >= 0) {
		return parts.slice(0, idx + 1).join(path.sep);
	}
	return undefined;
}
