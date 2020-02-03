import path from 'path';
import {cosmiconfig} from 'cosmiconfig';

export interface LoadConfigResult {
	config: unknown;
	filepath: string;
	isEmpty?: boolean;
}

export async function loadConfig(
	cwd: string,
	configPath?: string
): Promise<LoadConfigResult | null> {
	const explorer = cosmiconfig('commitlint');

	const explicitPath = configPath ? path.resolve(cwd, configPath) : undefined;
	const explore = explicitPath ? explorer.load : explorer.search;
	const searchPath = explicitPath ? explicitPath : cwd;
	const local = await explore(searchPath);

	if (local) {
		return local;
	}

	return null;
}
