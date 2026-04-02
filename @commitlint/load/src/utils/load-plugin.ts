import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { Plugin, PluginRecords } from "@commitlint/types";
import pc from "picocolors";

import { normalizePackageName, getShorthandName } from "./plugin-naming.js";
import { WhitespacePluginError, MissingPluginError } from "./plugin-errors.js";
import { resolveFromNpxCache } from "@commitlint/resolve-extends";

const require = createRequire(import.meta.url);

const __dirname = path.resolve(fileURLToPath(import.meta.url), "..");

const dynamicImport = async <T>(id: string): Promise<T> => {
	const imported = await import(path.isAbsolute(id) ? pathToFileURL(id).toString() : id);
	return ("default" in imported && imported.default) || imported;
};

function sanitizeErrorMessage(message: string): string {
	return message.replace(/\/[^/]+\/node_modules/g, "...").replace(/\\[^\\]+\\node_modules/g, "...");
}

function findPackageJson(dir: string): string | null {
	let current = dir;
	const root = path.parse(dir).root;
	while (current !== root) {
		const pkgPath = path.join(current, "package.json");
		if (fs.existsSync(pkgPath)) {
			return pkgPath;
		}
		current = path.dirname(current);
	}
	return null;
}

export interface LoadPluginOptions {
	debug?: boolean;
	searchPaths?: string[];
}

function normalizeOptions(options: LoadPluginOptions | boolean): LoadPluginOptions {
	if (typeof options === "boolean") {
		return { debug: options };
	}
	return options;
}

export default async function loadPlugin(
	plugins: PluginRecords,
	pluginName: string,
	options: LoadPluginOptions | boolean = {},
): Promise<PluginRecords> {
	const normalized = normalizeOptions(options);
	const { debug = false, searchPaths = [] } = normalized;

	for (const searchPath of searchPaths) {
		if (typeof searchPath !== "string" || !path.isAbsolute(searchPath)) {
			throw new Error(`Invalid searchPath "${searchPath}": must be an absolute path`);
		}
		if (!fs.existsSync(searchPath)) {
			throw new Error(`Invalid searchPath "${searchPath}": directory does not exist`);
		}
		if (!fs.statSync(searchPath).isDirectory()) {
			throw new Error(`Invalid searchPath "${searchPath}": must be a directory, not a file`);
		}
	}

	const longName = normalizePackageName(pluginName);
	const shortName = getShorthandName(longName);

	if (pluginName.match(/\s+/u)) {
		throw new WhitespacePluginError(pluginName, {
			pluginName: longName,
		});
	}

	const pluginKey = longName === pluginName ? shortName : pluginName;

	if (!plugins[pluginKey]) {
		let plugin: Plugin | undefined;
		let resolvedPath: string | undefined;

		// Try to load from npx cache directories using require.resolve
		const npxResolvedPath = resolveFromNpxCache(longName);
		if (npxResolvedPath) {
			try {
				plugin = await dynamicImport<Plugin>(npxResolvedPath);
				resolvedPath = npxResolvedPath;
			} catch (err) {
				if (debug) {
					console.debug(
						`Failed to load plugin ${longName} from npx cache: ${(err as Error).message}`,
					);
				}
			}
		}

		// Try to load from additional search paths (extended config's node_modules)
		if (!plugin) {
			for (const searchPath of searchPaths) {
				try {
					resolvedPath = require.resolve(longName, { paths: [searchPath] });
					plugin = await dynamicImport<Plugin>(resolvedPath);
					break;
				} catch (err) {
					if (debug) {
						console.debug(
							`Failed to load plugin ${longName} from ${searchPath}: ${(err as Error).message}`,
						);
					}
				}
			}
		}

		// Try default resolution as last resort
		if (!plugin) {
			try {
				plugin = await dynamicImport<Plugin>(longName);
				// Try to resolve path for debug logging
				try {
					resolvedPath = require.resolve(longName);
				} catch {
					// Ignore - path not critical
				}
			} catch (err) {
				let resolutionError: Error | undefined;
				try {
					resolvedPath = require.resolve(longName);
				} catch (resolveErr) {
					resolutionError = resolveErr as Error;
				}

				if (resolutionError) {
					// Resolution failed - throw MissingPluginError
					if (debug) {
						console.debug(`Failed to resolve plugin ${longName}: ${resolutionError.message}`);
					}
					throw new MissingPluginError(pluginName, sanitizeErrorMessage(resolutionError.message), {
						pluginName: longName,
						commitlintPath: path.resolve(__dirname, "../.."),
					});
				}

				// Resolution succeeded but import failed - rethrow original error
				throw err;
			}
		}

		// This step is costly, so skip if debug is disabled
		if (debug) {
			let version: string | null = null;

			if (resolvedPath) {
				try {
					const pkgPath = findPackageJson(path.dirname(resolvedPath));
					if (pkgPath) {
						version = require(pkgPath).version;
					}
				} catch {
					// Do nothing
				}
			}

			const loadedPluginAndVersion = version
				? `${longName}@${version}`
				: `${longName}, version unknown`;

			const fromPath = resolvedPath ? ` (from ${resolvedPath})` : "";
			console.log(pc.blue(`Loaded plugin ${pluginName} (${loadedPluginAndVersion})${fromPath}`));
		}

		if (plugin) {
			plugins[pluginKey] = plugin;
		} else {
			throw new MissingPluginError(pluginName, "Plugin loaded but is undefined", {
				pluginName: longName,
				commitlintPath: path.resolve(__dirname, "../.."),
			});
		}
	}

	return plugins;
}
