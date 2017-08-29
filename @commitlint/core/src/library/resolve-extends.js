import path from 'path';
import from from 'resolve-from';
import {merge, omit} from 'lodash';

// Resolve extend configs
export default function resolveExtends(config = {}, context = {}) {
	const {extends: e} = config;
	const extended = loadExtends(config, context).reduceRight(
		(r, c) => merge(r, omit(c, 'extends')),
		e ? {extends: e} : {}
	);

	// Remove deprecation warning in version 3
	if (typeof config === 'object' && 'wildcards' in config) {
		console.warn(
			`'wildcards' found in top-level configuration ignored. Remove them from your config to silence this warning.`
		);
	}

	return merge({}, extended, config);
}

// (any, string, string, Function) => any[];
function loadExtends(config = {}, context = {}) {
	return (config.extends || []).reduce((configs, raw) => {
		const load = context.require || require;
		const resolved = resolveConfig(raw, context);
		const c = load(resolved);

		// Remove deprecation warning in version 3
		if (typeof c === 'object' && 'wildcards' in c) {
			console.warn(
				`'wildcards' found in '${raw}' ignored. To silence this warning raise an issue at 'npm repo ${raw}' to remove the wildcards.`
			);
		}

		const ctx = merge({}, context, {
			cwd: path.dirname(resolved)
		});

		if (c && c.parserPreset) {
			c.parserPreset = resolveId(c.parserPreset, ctx);
		}

		return [...configs, c, ...loadExtends(c, ctx)];
	}, []);
}

function getId(raw = '', prefix = '') {
	const first = raw.charAt(0);
	const scoped = first === '@';
	const relative = first === '.';
	return scoped || relative ? raw : [prefix, raw].filter(String).join('-');
}

function resolveConfig(raw, context = {}) {
	const resolve = context.resolve || resolveId;
	const id = getId(raw, context.prefix);

	try {
		return resolve(id, context);
	} catch (err) {
		const legacy = getId(raw, 'conventional-changelog-lint-config');
		const resolved = resolve(legacy, context);
		console.warn(
			`Resolving ${raw} to legacy config ${legacy}. To silence this warning raise an issue at 'npm repo ${legacy}' to rename to ${id}.`
		);
		return resolved;
	}
}

function resolveId(id, context = {}) {
	return from(context.cwd || process.cwd(), id);
}
