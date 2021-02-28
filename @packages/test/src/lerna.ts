import fs from 'fs-extra';
import path from 'path';
import resolvePkg from 'resolve-pkg';
import * as fix from './fix';

export type LernaFixture = 'basic' | 'empty' | 'scoped';

export async function bootstrap(
	fixture: string,
	directory: string
): Promise<string> {
	const cwd = await fix.bootstrap(`fixtures/${fixture}`, directory);
	const lerna = 'lerna';
	await fs.mkdirp(path.join(cwd, 'node_modules', '@lerna'));
	await fs.symlink(
		resolvePkg('@lerna/project')!,
		path.join(cwd, 'node_modules', '@lerna', 'project')
	);
	await fs.symlink(resolvePkg(lerna)!, path.join(cwd, 'node_modules', 'lerna'));
	return cwd;
}
