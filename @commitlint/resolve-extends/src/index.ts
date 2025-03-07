import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL, fileURLToPath} from 'node:url';

import globalDirectory from 'global-directory';
import {moduleResolve} from 'import-meta-resolve';
import mergeWith from 'lodash.mergewith';
import resolveFrom_ from 'resolve-from';
import {validateConfig} from '@commitlint/config-validator';
import type {ParserPreset, UserConfig} from '@commitlint/types';

const dynamicImport = async <T>(id: string): Promise<T> => {
	const imported = await import(
		path.isAbsolute(id) ? pathToFileURL(id).toString() : id
	);
	return ('default' in imported && imported.default) || imported;
};

const pathSuffixes = [
	'',
	'.js',
	'.json',
	`${path.sep}index.js`,
	`${path.sep}index.json`,
];

const specifierSuffixes = ['', '.js', '.json', '/index.js', '/index.json'];

const conditions = new Set(['import', 'node']);

/**
 * @see moduleResolve
 */
export const resolveFrom = (lookup: string, parent?: string): string => {
	if (path.isAbsolute(lookup)) {
		for (const suffix of pathSuffixes) {
			const filename = lookup + suffix;
			if (fs.existsSync(filename)) {
				return filename;
			}
		}
	}

	let resolveError: Error | undefined;

	const base = pathToFileURL(
		parent
			? fs.statSync(parent).isDirectory()
				? path.join(parent, 'noop.js')
				: parent
			: import.meta.url,
	);

	for (const suffix of specifierSuffixes) {
		try {
			return fileURLToPath(moduleResolve(lookup + suffix, base, conditions));
		} catch (err) {
			if (!resolveError) {
				resolveError = err as Error;
			}
		}
	}

	try {
		/**
		 * Yarn P'n'P does not support pure ESM well, this is only a workaround for
		 * @see https://github.com/conventional-changelog/commitlint/issues/3936
		 */
		return resolveFrom_(path.dirname(fileURLToPath(base)), lookup);
	} catch {
		throw resolveError;
	}
};

/**
 *
 * @param resolvedParserPreset path resolved by {@link resolveFrom}
 * @returns path and parserOpts function retrieved from `resolvedParserPreset`
 */
export const loadParserPreset = async (
	resolvedParserPreset: string,
): Promise<Pick<ParserPreset, 'path' | 'parserOpts'>> => {
	const finalParserOpts = await dynamicImport(resolvedParserPreset);

	const relativeParserPath = path.relative(process.cwd(), resolvedParserPreset);

	return {
		path: `./${relativeParserPath}`.split(path.sep).join('/'),
		parserOpts: finalParserOpts,
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
	context: ResolveExtendsContext = {},
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
		e ? {extends: e} : {},
	);
}

async function loadExtends(
	config: UserConfig = {},
	context: ResolveExtendsContext = {},
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
			const resolvedParserPreset = resolveFrom(c.parserPreset, cwd);

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
	context: ResolveExtendsContext = {},
): string {
	const resolve = context.resolve || resolveId;
	const id = getId(raw, context.prefix);

	let resolved: string;
	try {
		resolved = resolve(id, context);
	} catch (err) {
		const legacy = getId(raw, 'conventional-changelog-lint-config');
		resolved = resolve(legacy, context);
		console.warn(
			`Resolving ${raw} to legacy config ${legacy}. To silence this warning raise an issue at 'npm repo ${legacy}' to rename to ${id}.`,
		);
	}

	return resolved;
}

function resolveId(
	specifier: string,
	context: ResolveExtendsContext = {},
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

export function resolveFromSilent(
	specifier: string,
	parent: string,
): string | void {
	try {
		return resolveFrom(specifier, parent);
	} catch {}
}

/**
 * @see https://github.com/sindresorhus/resolve-global/blob/682a6bb0bd8192b74a6294219bb4c536b3708b65/index.js#L7
 */
export function resolveGlobalSilent(specifier: string): string | void {
	for (const globalPackages of [
		globalDirectory.npm.packages,
		globalDirectory.yarn.packages,
	]) {
		try {
			return resolveFrom(specifier, globalPackages);
		} catch {}
	}
}
