import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { Plugin, PluginRecords } from "@commitlint/types";
import pc from "picocolors";

import { normalizePackageName, getShorthandName } from "./plugin-naming.js";
import { WhitespacePluginError, MissingPluginError } from "./plugin-errors.js";

const require = createRequire(import.meta.url);

const __dirname = path.resolve(fileURLToPath(import.meta.url), "..");

function getNpxCachePath(): string | void {
	const home = os.homedir();
	const npxPath = path.join(home, ".npm", "_npx");

	if (!fs.existsSync(npxPath)) {
		return undefined;
	}

	try {
		const entries = fs.readdirSync(npxPath, { withFileTypes: true });
		const dirs = entries
			.filter((entry) => entry.isDirectory())
			.map((entry) => ({
				name: entry.name,
				mtime: fs.statSync(path.join(npxPath, entry.name)).mtime,
			}))
			.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

		if (dirs.length > 0) {
			return path.join(npxPath, dirs[0].name, "node_modules");
		}
	} catch {
		// Ignore errors reading npx cache
	}

	return undefined;
}

const dynamicImport = async <T>(id: string): Promise<T> => {
	const imported = await import(
		path.isAbsolute(id) ? pathToFileURL(id).toString() : id
	);
	return ("default" in imported && imported.default) || imported;
};

export interface LoadPluginOptions {
	debug?: boolean;
	searchPaths?: string[];
}

export default async function loadPlugin(
	plugins: PluginRecords,
	pluginName: string,
	options: LoadPluginOptions = {},
): Promise<PluginRecords> {
	const { debug = false, searchPaths = [] } = options;
	const longName = normalizePackageName(pluginName);
	const shortName = getShorthandName(longName);

	// Get npx cache path for additional search
	const npxCachePath = getNpxCachePath();
	const allSearchPaths = npxCachePath
		? [npxCachePath, ...searchPaths]
		: searchPaths;

	if (pluginName.match(/\s+/u)) {
		throw new WhitespacePluginError(pluginName, {
			pluginName: longName,
		});
	}

	const pluginKey = longName === pluginName ? shortName : pluginName;

	if (!plugins[pluginKey]) {
		let plugin: Plugin | undefined;
		let resolvedPath: string | undefined;

		// Try to load from additional search paths first (e.g., npx cache, extended config's node_modules)
		for (const searchPath of allSearchPaths) {
			const pluginPath = path.join(searchPath, longName);
			if (fs.existsSync(pluginPath)) {
				try {
					plugin = await dynamicImport<Plugin>(pluginPath);
					resolvedPath = pluginPath;
					break;
				} catch {
					// Try next path
				}
			}
		}

		// If not found in search paths, try default resolution
		if (!plugin) {
			try {
				plugin = await dynamicImport<Plugin>(longName);
			} catch (pluginLoadErr) {
				try {
					resolvedPath = require.resolve(longName);
				} catch (error: any) {
					console.error(pc.red(`Failed to load plugin ${longName}.`));

					const message = error?.message || "Unknown error occurred";
					throw new MissingPluginError(pluginName, message, {
						pluginName: longName,
						commitlintPath: path.resolve(__dirname, "../.."),
					});
				}

				throw pluginLoadErr;
			}
		}

		// This step is costly, so skip if debug is disabled
		if (debug) {
			if (!resolvedPath) {
				try {
					resolvedPath = require.resolve(longName);
				} catch {
					// Ignore
				}
			}

			let version: string | null = null;

			try {
				version = require(`${longName}/package.json`).version;
			} catch (e) {
				// Do nothing
			}

			const loadedPluginAndVersion = version
				? `${longName}@${version}`
				: `${longName}, version unknown`;

			console.log(
				pc.blue(
					`Loaded plugin ${pluginName} (${loadedPluginAndVersion}) (from ${resolvedPath})`,
				),
			);
		}

		if (plugin) {
			plugins[pluginKey] = plugin;
		}
	}

	return plugins;
}
