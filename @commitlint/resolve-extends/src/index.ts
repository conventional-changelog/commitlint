import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';

import 'resolve-global';

import {resolve} from 'import-meta-resolve';
import mergeWith from 'lodash.mergewith';
import {validateConfig} from '@commitlint/config-validator';
import type {ParserPreset, UserConfig} from '@commitlint/types';

import importFresh from 'import-fresh';

export interface ResolveExtendsContext {
	cwd?: string;
	parserPreset?: string | ParserPreset;
	prefix?: string;
	resolve?(id: string, ctx?: {prefix?: string; cwd?: string}): string;
	resolveGlobal?: (id: string) => string;
	dynamicImport?<T>(id: string): T | Promise<T>;
}

export default async function resolveExtends(
	config: UserConfig = {},
	context: ResolveExtendsContext = {}
): Promise<UserConfig> {
	const {extends: e} = config;
	const extended = await loadExtends(config, context);
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

const dynamicImport = async <T>(id: string): Promise<T> => {
	const imported = await import(
		path.isAbsolute(id) ? pathToFileURL(id).toString() : id
	);
	return ('default' in imported && imported.default) || imported;
};

const resolveParserPreset = async (resolvedParserPreset: string) => {
	let finalParserPreset = resolvedParserPreset;
	let finalParserOpts: ParserPreset | undefined;
	let finalError: Error | undefined;

	for (const suffix of ['', '.js', '.json', '/index.js', '/index.json']) {
		try {
			finalParserOpts = await dynamicImport(resolvedParserPreset + suffix);
			finalParserPreset = resolvedParserPreset + suffix;
			break;
		} catch (err) {
			if (!finalError) {
				finalError = err as Error;
			}
		}
	}

	if (finalError) {
		throw finalError;
	}

	return {
		path: `./${path.relative(process.cwd(), finalParserPreset)}`
			.split(path.sep)
			.join('/'),
		parserOpts: finalParserOpts,
	};
};

const resolveFrom = (parent: string, id: string) => {
	let resolved: string | undefined;
	let error: Error | undefined;

	for (const suffix of ['', '.js', '.json', '/index.js', '/index.json']) {
		try {
			resolved = resolve(id + suffix, parent);
			break;
		} catch (err) {
			if (!error) {
				error = err as Error;
			}
		}
	}

	if (resolved) {
		return resolved;
	}

	throw (
		error ||
		Object.assign(new Error(`Cannot find module "${id}" from "${parent}"`), {
			code: 'MODULE_NOT_FOUND',
		})
	);
};

async function loadExtends(
	config: UserConfig = {},
	context: ResolveExtendsContext = {}
): Promise<UserConfig[]> {
	const {extends: e} = config;
	const ext = e ? (Array.isArray(e) ? e : [e]) : [];

	return await ext.reduce(async (configs, raw) => {
		const resolved = resolveConfig(raw, context);
		const c = await (context.dynamicImport || dynamicImport)<{
			parserPreset?: string;
		}>(resolved);
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
				...resolveParserPreset(resolvedParserPreset),
			};

			ctx.parserPreset = parserPreset;
			config.parserPreset = parserPreset;
		}

		validateConfig(resolved, config);

		return [...(await configs), ...(await loadExtends(c, ctx)), c];
	}, Promise.resolve<UserConfig[]>([]));
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
	const resolve = context.resolve || tryResolveId;
	const id = getId(raw, context.prefix);

	let resolved: string;
	try {
		resolved = resolve(id, context);
	} catch (err) {
		const legacy = getId(raw, 'conventional-changelog-lint-config');
		resolved = resolve(legacy, context);
		console.warn(
			`Resolving ${raw} to legacy config ${legacy}. To silence this warning raise an issue at 'npm repo ${legacy}' to rename to ${id}.`
		);
	}
	return path.isAbsolute(resolved)
		? pathToFileURL(resolved).toString()
		: resolved;
}

function tryResolveId(id: string, context: ResolveExtendsContext) {
	const cwd = context.cwd || process.cwd();

	let resolved: string | undefined;

	for (const suffix of ['', '.js', '.json', '/index.js', '/index.json']) {
		try {
			resolved = resolve(
				id + suffix,
				pathToFileURL(path.resolve(cwd, '__test__.js')).toString()
			);
			if (/^file:/.test(resolved)) {
				resolved = fileURLToPath(resolved);
			}
			break;
		} catch {}
	}

	if (resolved) {
		return resolved;
	}

	return resolveId(id, context);
}

function resolveId(id: string, context: ResolveExtendsContext = {}): string {
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
	throw Object.assign(err, {code: 'MODULE_NOT_FOUND'});
}

function resolveFromSilent(cwd: string, id: string): string | void {
	try {
		return resolveFrom(cwd, id);
	} catch (err) {}
}

function resolveGlobalSilent(id: string): string | void {
	try {
		const resolveGlobal = importFresh<(id: string) => string>('resolve-global');
		return resolveGlobal(id);
	} catch (err) {}
}
