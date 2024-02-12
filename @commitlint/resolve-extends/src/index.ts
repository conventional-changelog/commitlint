import path from 'path';

import 'resolve-global';
import resolveFrom from 'resolve-from';
import mergeWith from 'lodash/mergewith';
import {validateConfig} from '@commitlint/config-validator';
import {UserConfig} from '@commitlint/types';

const importFresh = require('import-fresh');

export interface ResolveExtendsContext {
	cwd?: string;
	parserPreset?: unknown;
	prefix?: string;
	resolve?(id: string, ctx?: {prefix?: string; cwd?: string}): string;
	resolveGlobal?: (id: string) => string;
	require?<T>(id: string): T;
}

export default function resolveExtends(
	config: UserConfig = {},
	context: ResolveExtendsContext = {}
): UserConfig {
	const {extends: e} = config;
	const extended = loadExtends(config, context);
	extended.push(config);
	return extended.reduce(
		(r, {extends: _, ...c}) =>
			mergeWith(r, c, (objValue, srcValue, key) => {
				if (key === 'plugins') {
					if (Array.isArray(objValue)) {
						return objValue.concat(srcValue);
					}
				} else if (Array.isArray(objValue)) {
					return srcValue;
				}
			}),
		e ? {extends: e} : {}
	);
}

function loadExtends(
	config: UserConfig = {},
	context: ResolveExtendsContext = {}
): UserConfig[] {
	const {extends: e} = config;
	const ext = e ? (Array.isArray(e) ? e : [e]) : [];

	return ext.reduce<UserConfig[]>((configs, raw) => {
		const load = context.require || require;
		const resolved = resolveConfig(raw, context);
		const c = load(resolved);
		const cwd = path.dirname(resolved);
		const ctx = {...context, cwd};

		// Resolve parser preset if none was present before
		if (
			!context.parserPreset &&
			typeof c === 'object' &&
			typeof c.parserPreset === 'string'
		) {
			const resolvedParserPreset = resolveFrom(cwd, c.parserPreset);
			const parserPreset = {
				name: c.parserPreset,
				path: `./${path.relative(process.cwd(), resolvedParserPreset)}`
					.split(path.sep)
					.join('/'),
				parserOpts: require(resolvedParserPreset),
			};

			ctx.parserPreset = parserPreset;
			config.parserPreset = parserPreset;
		}

		validateConfig(resolved, config);

		return [...configs, ...loadExtends(c, ctx), c];
	}, []);
}

function getId(raw: string = '', prefix: string = ''): string {
	const first = raw.charAt(0);
	const scoped = first === '@';
	const relative = first === '.';
	const absolute = path.isAbsolute(raw);

	if (scoped) {
		return raw.includes('/') ? raw : [raw, prefix].filter(String).join('/');
	}

	return relative || absolute ? raw : [prefix, raw].filter(String).join('-');
}

function resolveConfig(
	raw: string,
	context: ResolveExtendsContext = {}
): string {
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

function resolveId(
	id: string,
	context: {cwd?: string; resolveGlobal?: (id: string) => string | void} = {}
): string {
	const cwd = context.cwd || process.cwd();
	const localPath = resolveFromSilent(cwd, id);

	if (typeof localPath === 'string') {
		return localPath;
	}

	const resolveGlobal = context.resolveGlobal || resolveGlobalSilent;
	const globalPath = resolveGlobal(id);

	if (typeof globalPath === 'string') {
		return globalPath;
	}

	const err = new Error(`Cannot find module "${id}" from "${cwd}"`);
	(err as any).code = 'MODULE_NOT_FOUND';
	throw err;
}

function resolveFromSilent(cwd: string, id: string): string | void {
	try {
		return resolveFrom(cwd, id);
	} catch (err) {}
}

function resolveGlobalSilent(id: string): string | void {
	try {
		const resolveGlobal = importFresh('resolve-global');
		return resolveGlobal(id);
	} catch (err) {}
}
