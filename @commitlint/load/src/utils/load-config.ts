import {existsSync, readFileSync} from 'fs';
import path from 'path';

import {
	cosmiconfig,
	defaultLoadersSync,
	type Loader,
	defaultLoaders,
} from 'cosmiconfig';
import {TypeScriptLoader} from 'cosmiconfig-typescript-loader';

export interface LoadConfigResult {
	config: unknown;
	filepath: string;
	isEmpty?: boolean;
}

const moduleName = 'commitlint';

export async function loadConfig(
	cwd: string,
	configPath?: string
): Promise<LoadConfigResult | null> {
	let tsLoaderInstance: Loader | undefined;
	const tsLoader: Loader = (...args) => {
		if (!tsLoaderInstance) {
			tsLoaderInstance = TypeScriptLoader();
		}
		return tsLoaderInstance(...args);
	};

	// If dynamic await is supported (Node >= v20.8.0) or directory uses ESM, support
	// async js/cjs loaders (dynamic import). Otherwise, use synchronous js/cjs loaders.
	const loaders =
		isDynamicAwaitSupported() || isEsmModule(cwd)
			? defaultLoaders
			: defaultLoadersSync;

	const explorer = cosmiconfig(moduleName, {
		searchPlaces: [
			// cosmiconfig overrides default searchPlaces if any new search place is added (For e.g. `*.ts` files),
			// we need to manually merge default searchPlaces from https://github.com/davidtheclark/cosmiconfig#searchplaces
			'package.json',
			`.${moduleName}rc`,
			`.${moduleName}rc.json`,
			`.${moduleName}rc.yaml`,
			`.${moduleName}rc.yml`,
			`.${moduleName}rc.js`,
			`.${moduleName}rc.cjs`,
			`.${moduleName}rc.mjs`,
			`${moduleName}.config.js`,
			`${moduleName}.config.cjs`,
			`${moduleName}.config.mjs`,

			// files supported by TypescriptLoader
			`.${moduleName}rc.ts`,
			`.${moduleName}rc.cts`,
			`${moduleName}.config.ts`,
			`${moduleName}.config.cts`,
		],
		loaders: {
			'.ts': tsLoader,
			'.cts': tsLoader,
			'.cjs': loaders['.cjs'],
			'.js': loaders['.js'],
		},
	});

	const explicitPath = configPath ? path.resolve(cwd, configPath) : undefined;
	const explore = explicitPath ? explorer.load : explorer.search;
	const searchPath = explicitPath ? explicitPath : cwd;
	const local = await explore(searchPath);

	if (local) {
		return local;
	}

	return null;
}

// See the following issues for more context, contributing to failing Jest tests:
//  - Issue: https://github.com/nodejs/node/issues/40058
//  - Resolution: https://github.com/nodejs/node/pull/48510 (Node v20.8.0)
export const isDynamicAwaitSupported = () => {
	const [major, minor] = process.version
		.replace('v', '')
		.split('.')
		.map((val) => parseInt(val));

	return major >= 20 && minor >= 8;
};

// Is the given directory set up to use ESM (ECMAScript Modules)?
export const isEsmModule = (cwd: string) => {
	const packagePath = path.join(cwd, 'package.json');

	if (!existsSync(packagePath)) {
		return false;
	}

	const packageJSON = readFileSync(packagePath, {encoding: 'utf-8'});
	return JSON.parse(packageJSON)?.type === 'module';
};
