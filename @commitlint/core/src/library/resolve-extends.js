import path from 'path';
import from from 'resolve-from';
import {merge, omit} from 'lodash';

// Resolve extend configs
export default function resolveExtends(config = {}, context = {}) {
	const {extends: e} = config;
	const extended = loadExtends(config, context)
		.reduceRight((r, c) => merge(r, omit(c, 'extends')), e ? {extends: e} : {});

	// Remove deprecation warning in version 3
	if (typeof config === 'object' && 'wildcards' in config) {
		console.warn(`'wildcards' found in top-level configuration ignored. Remove them from your config to silence this warning.`);
	}

	return merge({}, extended, config);
}

// (any, string, string, Function) => any[];
function loadExtends(config = {}, context = {}) {
	return (config.extends || []).reduce((configs, raw) => {
		const id = getId(raw, context.prefix);
		const resolve = context.resolve || resolveId;
		const resolved = resolve(id, context);
		const load = context.require || require;
		const c = load(resolved);

		// Remove deprecation warning in version 3
		if (typeof c === 'object' && 'wildcards' in c) {
			console.warn(`'wildcards' found in '${id}' ignored. Raise an issue at 'npm repo ${id}' to remove the wildcards and silence this warning.`);
		}

		const ctx = merge({}, context, {
			cwd: path.dirname(resolved)
		});

		return [...configs, c, ...loadExtends(c, ctx)];
	}, []);
}

function getId(raw = '', prefix = '') {
	const first = raw.charAt(0);
	const scoped = first === '@';
	const relative = first === '.';
	return (scoped || relative) ? raw : [prefix, raw].filter(String).join('-');
}

function resolveId(id, context = {}) {
	return from(context.cwd || process.cwd(), id);
}
