import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';

import {Plugin, PluginRecords} from '@commitlint/types';
import chalk from 'chalk';

import {normalizePackageName, getShorthandName} from './plugin-naming.js';
import {WhitespacePluginError, MissingPluginError} from './plugin-errors.js';

const require = createRequire(import.meta.url);

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..');

const dynamicImport = async <T>(id: string): Promise<T> => {
	const imported = await import(
		path.isAbsolute(id) ? pathToFileURL(id).toString() : id
	);
	return ('default' in imported && imported.default) || imported;
};

export default async function loadPlugin(
	plugins: PluginRecords,
	pluginName: string,
	debug: boolean = false
): Promise<PluginRecords> {
	const longName = normalizePackageName(pluginName);
	const shortName = getShorthandName(longName);
	let plugin: Plugin;

	if (pluginName.match(/\s+/u)) {
		throw new WhitespacePluginError(pluginName, {
			pluginName: longName,
		});
	}

	const pluginKey = longName === pluginName ? shortName : pluginName;

	if (!plugins[pluginKey]) {
		try {
			plugin = await dynamicImport<Plugin>(longName);
		} catch (pluginLoadErr) {
			try {
				// Check whether the plugin exists
				require.resolve(longName);
			} catch (error: any) {
				// If the plugin can't be resolved, display the missing plugin error (usually a config or install error)
				console.error(chalk.red(`Failed to load plugin ${longName}.`));

				const message = error?.message || 'Unknown error occurred';
				throw new MissingPluginError(pluginName, message, {
					pluginName: longName,
					commitlintPath: path.resolve(__dirname, '../..'),
				});
			}

			// Otherwise, the plugin exists and is throwing on module load for some reason, so print the stack trace.
			throw pluginLoadErr;
		}

		// This step is costly, so skip if debug is disabled
		if (debug) {
			const resolvedPath = require.resolve(longName);

			let version = null;

			try {
				version = require(`${longName}/package.json`).version;
			} catch (e) {
				// Do nothing
			}

			const loadedPluginAndVersion = version
				? `${longName}@${version}`
				: `${longName}, version unknown`;

			console.log(
				chalk.blue(
					`Loaded plugin ${pluginName} (${loadedPluginAndVersion}) (from ${resolvedPath})`
				)
			);
		}

		plugins[pluginKey] = plugin;
	}

	return plugins;
}
