import importFrom from 'import-from';
import {merge, omit} from 'lodash';

const cwd = importFrom.bind(null, process.cwd());

// Resolve extend configs
export default function resolveExtends(config = {}, prefix = '', key = 'extends', require = cwd) {
	const extended = loadExtends(config, prefix, key, require)
		.reduceRight((r, c) => merge(r, omit(c, [key])), config[key] ? {[key]: config[key]} : {});

	// Remove deprecation warning in version 3
	if (typeof c === 'object' && 'wildcards' in config) {
		console.warn(`'wildcards' found in top-level configuration ignored. Remove them from your config to silence this warning.`);
	}

	return merge({}, extended, config);
}

// (any, string, string, Function) => any[];
function loadExtends(config = {}, prefix = '', key = 'extends', require = cwd) {
	const toExtend = Object.values(config[key] || []);
	return toExtend.reduce((configs, raw) => {
		const id = [prefix, raw].filter(String).join('-');
		const c = require(id);

		// Remove deprecation warning in version 3
		if (typeof c === 'object' && 'wildcards' in c) {
			console.warn(`'wildcards' found in '${id}' ignored. Raise an issue at 'npm repo ${id}' to remove the wildcards and silence this warning.`);
		}

		return [...configs, c, ...loadExtends(c, prefix, key, require)];
	}, []);
}
