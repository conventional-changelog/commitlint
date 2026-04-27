import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

import globalDirectory from "global-directory";
import { moduleResolve } from "import-meta-resolve";
import { mergeWith } from "es-toolkit/compat";
import resolveFrom_ from "resolve-from";
import { validateConfig } from "@commitlint/config-validator";
import type { ParserPreset, UserConfig } from "@commitlint/types";

const require = createRequire(import.meta.url);

const dynamicImport = async <T>(id: string): Promise<T> => {
	if (id.endsWith(".json")) {
		return require(id);
	}

	const imported = await import(
		path.isAbsolute(id) ? pathToFileURL(id).toString() : id
	);
	return ("default" in imported && imported.default) || imported;
};

const pathSuffixes = [
	"",
	".js",
	".json",
	`${path.sep}index.js`,
	`${path.sep}index.json`,
];

const specifierSuffixes = ["", ".js", ".json", "/index.js", "/index.json"];

const conditions = new Set(["import", "node"]);

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
				? path.join(parent, "noop.js")
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
): Promise<Pick<ParserPreset, "path" | "parserOpts">> => {
	const finalParserOpts = await dynamicImport(resolvedParserPreset);

	const relativeParserPath = path.relative(process.cwd(), resolvedParserPreset);

	return {
		path: `./${relativeParserPath}`.split(path.sep).join("/"),
		parserOpts: finalParserOpts,
	};
};

export interface ResolveExtendsContext {
	cwd?: string;
	parserPreset?: string | ParserPreset;
	prefix?: string;
	resolve?(id: string, ctx?: { prefix?: string; cwd?: string }): string;
	resolveGlobal?: (id: string) => string;
	dynamicImport?<T>(id: string): T | Promise<T>;
}

export default async function resolveExtends(
	config: UserConfig = {},
	context: ResolveExtendsContext = {},
): Promise<UserConfig> {
	const { extends: e } = config;
	const extended = await loadExtends(config, context);
	extended.push(config);
	return extended.reduce(
		(r, { extends: _, ...c }) =>
			mergeWith(r, c, (objValue, srcValue, key) => {
				if (key === "plugins") {
					if (Array.isArray(objValue)) {
						return objValue.concat(srcValue);
					}
				} else if (Array.isArray(objValue)) {
					return srcValue;
				}
			}),
		e ? { extends: e } : {},
	);
}

async function loadExtends(
	config: UserConfig = {},
	context: ResolveExtendsContext = {},
): Promise<UserConfig[]> {
	const { extends: e } = config;
	const ext = e ? (Array.isArray(e) ? e : [e]) : [];

	return await ext.reduce(async (configs, raw) => {
		const resolved = resolveConfig(raw, context);

		// Shallow-copy so we never mutate an ESM namespace object (#4647).
		const c = {
			...(await (context.dynamicImport || dynamicImport)<{
				parserPreset?: string | ParserPreset;
			}>(resolved)),
		};
		const cwd = path.dirname(resolved);
		const ctx = { ...context, cwd };

		// Always resolve string parser presets from extended configs so that
		// their parserOpts (headerPattern, etc.) are available for merging.
		// Previously this was skipped when the user provided any parserPreset,
		// which caused partial user overrides (e.g. just issuePrefixes) to
		// lose the extended preset's headerPattern (see #4640).
		if (typeof c === "object" && typeof c.parserPreset === "string") {
			const resolvedParserPreset = resolveFrom(c.parserPreset, cwd);

			const parserPreset: ParserPreset = {
				name: c.parserPreset,
				...(await loadParserPreset(resolvedParserPreset)),
			};

			ctx.parserPreset = parserPreset;
			c.parserPreset = parserPreset;
		}

		validateConfig(resolved, config);

		return [...(await configs), ...(await loadExtends(c, ctx)), c];
	}, Promise.resolve<UserConfig[]>([]));
}

function getId(raw: string = "", prefix: string = ""): string {
	const first = raw.charAt(0);
	const scoped = first === "@";
	const relative = first === ".";
	const absolute = path.isAbsolute(raw);

	if (scoped) {
		return raw.includes("/") ? raw : [raw, prefix].filter(String).join("/");
	}

	return relative || absolute ? raw : [prefix, raw].filter(String).join("-");
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
		const legacy = getId(raw, "conventional-changelog-lint-config");
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

	if (typeof localPath === "string") {
		return localPath;
	}

	const resolveGlobal = context.resolveGlobal || resolveGlobalSilent;
	const globalPath = resolveGlobal(specifier);

	if (typeof globalPath === "string") {
		return globalPath;
	}

	const err = new Error(`Cannot find module "${specifier}" from "${cwd}"`);
	throw Object.assign(err, { code: "MODULE_NOT_FOUND" });
}

export function resolveFromSilent(
	specifier: string,
	parent: string,
): string | undefined {
	try {
		return resolveFrom(specifier, parent);
	} catch {}
}

/**
 * Get the npm cache directory.
 * Respects npm config (npm_config_cache env var or npm config get cache).
 */
function getNpmCacheDir(): string {
	if (process.env.npm_config_cache) {
		return process.env.npm_config_cache;
	}

	try {
		const { execSync } = require("child_process");
		const cacheDir = execSync("npm config get cache", {
			encoding: "utf8",
			stdio: ["pipe", "pipe", "ignore"],
		}).trim();
		if (cacheDir) {
			return cacheDir;
		}
	} catch {
		// Ignore errors
	}

	const home = os.homedir();
	return path.join(home, ".npm");
}

let npxCachePathsCache: string[] | undefined;

/**
 * Get the npx cache directory paths.
 * npx stores packages in a subdirectory of the npm cache (e.g., ~/.npm/_npx).
 * Results are memoized and sorted by mtime (most recent first) for deterministic resolution.
 */
function getNpxCachePaths(): string[] {
	if (npxCachePathsCache) {
		return npxCachePathsCache;
	}

	const npmCache = getNpmCacheDir();
	const npxPath = path.join(npmCache, "_npx");

	if (!fs.existsSync(npxPath)) {
		npxCachePathsCache = [];
		return [];
	}

	try {
		const entries = fs.readdirSync(npxPath, { withFileTypes: true });
		const dirs = entries
			.filter((entry) => entry.isDirectory())
			.map((entry) => ({
				path: path.join(npxPath, entry.name, "node_modules"),
				mtime: fs.statSync(path.join(npxPath, entry.name)).mtime,
			}))
			.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

		npxCachePathsCache = dirs.map((d) => d.path);
	} catch (err) {
		if (process.env.DEBUG === "true") {
			console.debug(`Failed to read npx cache: ${(err as Error).message}`);
		}
		npxCachePathsCache = [];
	}

	return npxCachePathsCache;
}

/**
 * Resolve a module specifier from npx cache directories.
 * Iterates all npx cache directories and returns the first successful resolution.
 * Uses require.resolve for proper Node module resolution (respects package.json main/exports).
 */
export function resolveFromNpxCache(specifier: string): string | undefined {
	for (const npxDir of getNpxCachePaths()) {
		try {
			return require.resolve(specifier, { paths: [npxDir] });
		} catch (err) {
			if (process.env.DEBUG === "true") {
				console.debug(
					`Failed to resolve ${specifier} from ${npxDir}: ${(err as Error).message}`,
				);
			}
		}
	}
	return undefined;
}

/**
 * @see https://github.com/sindresorhus/resolve-global/blob/682a6bb0bd8192b74a6294219bb4c536b3708b65/index.js#L7
 */
export function resolveGlobalSilent(specifier: string): string | undefined {
	for (const globalPackages of [
		globalDirectory.npm.packages,
		globalDirectory.yarn.packages,
	]) {
		try {
			return resolveFrom(specifier, globalPackages);
		} catch (err) {
			if (process.env.DEBUG === "true") {
				console.debug(
					`Failed to resolve ${specifier} from global: ${(err as Error).message}`,
				);
			}
		}
	}

	// Check npx cache directories
	return resolveFromNpxCache(specifier);
}
