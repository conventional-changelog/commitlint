import path from 'path';
import fs from 'fs-extra';
import resolvePkg from 'resolve-pkg';
import * as fix from './fix';

export type LernaFixture = 'basic' | 'empty' | 'scoped';

export async function bootstrap(
	fixture: string,
	directory: string
): Promise<string> {
	const cwd = await fix.bootstrap(`fixtures/${fixture}`, directory);
	// this used to test lerna v2 and v3
	// the v2 option is removed here, lerna version tests as well
	// all the code to test differnt version is still in place
	// cause i'm not sure how to remove this properly
	const lerna = 'lerna-v3';
	await fs.mkdirp(path.join(cwd, 'node_modules', '@lerna'));
	await fs.symlink(
		resolvePkg('@lerna/project')!,
		path.join(cwd, 'node_modules', '@lerna', 'project')
	);
	await fs.symlink(resolvePkg(lerna)!, path.join(cwd, 'node_modules', 'lerna'));
	return cwd;
}
