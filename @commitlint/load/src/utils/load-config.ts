import {
	cosmiconfig,
	defaultLoadersSync,
	Options,
	type Loader,
} from 'cosmiconfig';
import {TypeScriptLoader} from 'cosmiconfig-typescript-loader';
import path from 'path';

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

	const {searchPlaces, loaders} = getDynamicAwaitConfig(cwd);

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

			...(searchPlaces || []),
		],
		loaders: {
			'.ts': tsLoader,
			'.cts': tsLoader,

			...(loaders || {}),
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

// See the following issues for more context:
//  - Issue: https://github.com/nodejs/node/issues/40058
//  - Resolution: https://github.com/nodejs/node/pull/48510 (Node v20.8.0)
export const isDynamicAwaitSupported = () => {
	const [major, minor] = process.version
		.replace('v', '')
		.split('.')
		.map((val) => parseInt(val));

	return major >= 20 && minor >= 8;
};

// If dynamic await is supported (Node >= v20.8.0), support mjs config.
// Otherwise, don't support mjs and use synchronous js/cjs loaders.
export const getDynamicAwaitConfig = (cwd?: string): Partial<Options> => {
	const dynamic = isDynamicAwaitSupported();
	if (dynamic) {
		return {
			searchPlaces: [`.${moduleName}rc.mjs`, `${moduleName}.config.mjs`],
			loaders: {},
		};
	}

	if (cwd) {
		let type = null;
		try {
			const manifestPath = path.join(cwd, 'package.json');
			type = require(manifestPath).type;
		} catch (e) {
			// Do nothing
		}
		if (type === 'module') {
			return {
				searchPlaces: [],
				loaders: {
					'.cjs': defaultLoadersSync['.cjs'],
				},
			};
		}
	}

	return {
		searchPlaces: [],
		loaders: {
			'.cjs': defaultLoadersSync['.cjs'],
			'.js': defaultLoadersSync['.js'],
		},
	};
};
