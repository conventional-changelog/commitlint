import {cosmiconfig, type Loader} from 'cosmiconfig';
import {TypeScriptLoader} from 'cosmiconfig-typescript-loader';
import path from 'path';

export interface LoadConfigResult {
	config: unknown;
	filepath: string;
	isEmpty?: boolean;
}

export async function loadConfig(
	cwd: string,
	configPath?: string
): Promise<LoadConfigResult | null> {
	const moduleName = 'commitlint';

	let tsLoaderInstance: Loader | undefined;
	const tsLoader: Loader = (...args) => {
		if (!tsLoaderInstance) {
			tsLoaderInstance = TypeScriptLoader();
		}
		return tsLoaderInstance(...args);
	};

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
			`${moduleName}.config.js`,
			`${moduleName}.config.cjs`,

			// files supported by TypescriptLoader
			`.${moduleName}rc.ts`,
			`.${moduleName}rc.cts`,
			`${moduleName}.config.ts`,
			`${moduleName}.config.cts`,
		],
		loaders: {
			'.ts': tsLoader,
			'.cts': tsLoader,
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
