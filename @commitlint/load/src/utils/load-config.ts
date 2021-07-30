import path from 'path';
import {cosmiconfig} from 'cosmiconfig';
import TSLoader from '@endemolshinegroup/cosmiconfig-typescript-loader';

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
	const explorer = cosmiconfig('commitlint', {
		searchPlaces: [
			'package.json',
			`.${moduleName}rc`,
			`.${moduleName}rc.json`,
			`.${moduleName}rc.yaml`,
			`.${moduleName}rc.yml`,
			`.${moduleName}rc.ts`,
			`.${moduleName}rc.js`,
			`${moduleName}.config.ts`,
			`${moduleName}.config.js`,
		],
		loaders: {
			'.ts': TSLoader,
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
