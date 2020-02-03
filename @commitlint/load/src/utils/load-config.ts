import path from 'path';
import {CosmiconfigResult} from 'cosmiconfig';
import cosmiconfig from 'cosmiconfig';

export async function loadConfig(
	cwd: string,
	configPath?: string
): Promise<CosmiconfigResult> {
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
