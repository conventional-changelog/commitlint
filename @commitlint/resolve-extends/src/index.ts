import path from 'path';
import {pathToFileURL} from 'url';

import 'resolve-global';

import {moduleResolve} from 'import-meta-resolve';
import mergeWith from 'lodash.mergewith';
import {validateConfig} from '@commitlint/config-validator';
import type {ParserPreset, UserConfig} from '@commitlint/types';
import importFresh from 'import-fresh';

/**
 * @see moduleResolve
 */
export const resolveFrom = (specifier: string, parent?: string): string => {
	let resolved: URL;
	let resolveError: Error | undefined;

	for (const suffix of ['', '.js', '.json', '/index.js', '/index.json']) {
		try {
			resolved = moduleResolve(
				specifier + suffix,
				pathToFileURL(parent ? parent : import.meta.url)
			);
			return resolved.pathname;
		} catch (err) {
			if (!resolveError) {
				resolveError = err as Error;
			}
		}
	}

	throw resolveError;
};

/**
 *
 * @param resolvedParserPreset path resolved by {@link resolveFrom}
 * @returns path and parserOpts function retrieved from `resolvedParserPreset`
 */
export const loadParserPreset = async (
	resolvedParserPreset: string
): Promise<Pick<ParserPreset, 'path' | 'parserOpts'>> => {
	const finalParserOpts = await import(resolvedParserPreset);

	const relativeParserPath = path.relative(process.cwd(), resolvedParserPreset);

	return {
		path: `./${relativeParserPath}`.split(path.sep).join('/'),
		parserOpts: finalParserOpts.default,
	};
};

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

/**
 * Fake file name to provide {@link moduleResolve} a filename to resolve from the configuration cwd
 */
const FAKE_FILE_NAME_FOR_RESOLVER = '__';

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
			const resolvedParserPreset = resolveFrom(
				c.parserPreset,
				path.join(cwd, FAKE_FILE_NAME_FOR_RESOLVER)
			);

			const parserPreset: ParserPreset = {
				name: c.parserPreset,
				...(await loadParserPreset(resolvedParserPreset)),
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

	return resolved;
}

function tryResolveId(id: string, context: ResolveExtendsContext) {
	const cwd = context.cwd || process.cwd();

	let resolved: string | undefined;

	for (const suffix of ['', '.js', '.json', '/index.js', '/index.json']) {
		try {
			resolved = moduleResolve(
				id + suffix,
				pathToFileURL(path.join(cwd, id))
			).pathname;

			return resolved;
		} catch {}
	}

	return resolveId(id, context);
}

function resolveId(
	specifier: string,
	context: ResolveExtendsContext = {}
): string {
	const cwd = context.cwd || process.cwd();
	const localPath = resolveFromSilent(specifier, cwd);

	if (typeof localPath === 'string') {
		return localPath;
	}

	const resolveGlobal = context.resolveGlobal || resolveGlobalSilent;
	const globalPath = resolveGlobal(specifier);

	if (typeof globalPath === 'string') {
		return globalPath;
	}

	const err = new Error(`Cannot find module "${specifier}" from "${cwd}"`);
	throw Object.assign(err, {code: 'MODULE_NOT_FOUND'});
}

function resolveFromSilent(specifier: string, parent: string): string | void {
	try {
		return resolveFrom(
			specifier,
			path.join(parent, FAKE_FILE_NAME_FOR_RESOLVER)
		);
	} catch (err) {}
}

function resolveGlobalSilent(specifier: string): string | void {
	try {
		const resolveGlobal = importFresh<(id: string) => string>('resolve-global');
		return resolveGlobal(specifier);
	} catch (err) {}
}
