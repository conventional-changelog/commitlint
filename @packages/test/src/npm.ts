import path from 'path';

import fs from 'fs-extra';
import resolvePkg from 'resolve-pkg';

import * as git from './git.js';

export async function installModules(cwd: string) {
	const manifestPath = path.join(cwd, 'package.json');
	const targetModulesPath = path.join(cwd, 'node_modules');

	if (await fs.pathExists(manifestPath)) {
		const {dependencies = {}, devDependencies = {}} = await fs.readJson(
			manifestPath
		);
		const deps = Object.keys({...dependencies, ...devDependencies});
		await Promise.all(
			deps.map(async (dependency: any) => {
				const sourcePath = resolvePkg(dependency);

				if (!sourcePath) {
					throw new Error(`Could not resolve dependency ${dependency}`);
				}

				const sourceModulesPath = findParentPath(sourcePath, 'node_modules');

				if (!sourceModulesPath) {
					throw new Error(`Could not determine node_modules for ${sourcePath}`);
				}

				const relativePath = path.relative(sourceModulesPath, sourcePath);
				const targetPath = path.join(targetModulesPath, relativePath);

				await fs.mkdirp(path.join(targetPath, '..'));
				await fs.symlink(sourcePath, targetPath);
			})
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
	dirname: string
): string | undefined {
	const rawFragments = parentPath.split(path.sep);

	const {matched, fragments} = rawFragments.reduceRight(
		({fragments, matched}, item) => {
			if (item === dirname && !matched) {
				return {fragments, matched: true};
			}

			if (!matched && fragments.length > 0) {
				fragments.pop();
			}

			return {fragments, matched};
		},
		{fragments: rawFragments, matched: false}
	);

	return matched ? fragments.join(path.sep) : undefined;
}
