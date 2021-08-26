import path from 'path';
import chalk from 'chalk';
import {normalizePackageName, getShorthandName} from './plugin-naming';
import {WhitespacePluginError, MissingPluginError} from './plugin-errors';
import {PluginRecords} from '@commitlint/types';

export default function loadPlugin(
	plugins: PluginRecords,
	pluginName: string,
	debug: boolean = false
): PluginRecords {
	const longName = normalizePackageName(pluginName);
	const shortName = getShorthandName(longName);
	let plugin = null;

	if (pluginName.match(/\s+/u)) {
		throw new WhitespacePluginError(pluginName, {
			pluginName: longName,
		});
	}

	const pluginKey = longName === pluginName ? shortName : pluginName;

	if (!plugins[pluginKey]) {
		try {
			plugin = require(longName);
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
