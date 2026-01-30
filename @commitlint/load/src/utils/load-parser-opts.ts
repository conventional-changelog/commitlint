import { ParserPreset } from "@commitlint/types";

type Awaitable<T> = T | PromiseLike<T>;

function isObjectLike(obj: unknown): obj is Record<string, unknown> {
	return Boolean(obj) && typeof obj === "object"; // typeof null === 'object'
}

function isParserOptsFunction<T extends ParserPreset>(
	obj: T,
): obj is T & {
	parserOpts: (
		cb: (_: never, parserOpts: Record<string, unknown>) => unknown,
	) => Record<string, unknown> | undefined;
} {
	return typeof obj.parserOpts === "function";
}

export async function loadParserOpts(
	pendingParser:
		| string
		| Awaitable<ParserPreset>
		| (() => Awaitable<ParserPreset>)
		| undefined,
): Promise<ParserPreset | undefined> {
	if (typeof pendingParser === "function") {
		return loadParserOpts(pendingParser());
	}

	if (!pendingParser || typeof pendingParser !== "object") {
		return undefined;
	}
	// Await for the module, loaded with require
	const parser = await pendingParser;

	// exit early, no opts to resolve
	if (!parser.parserOpts) {
		return parser;
	}

	// Pull nested parserOpts, might happen if overwritten with a module in main config
	if (typeof parser.parserOpts === "object") {
		// Await parser opts if applicable
		parser.parserOpts = await parser.parserOpts;
		if (
			isObjectLike(parser.parserOpts) &&
			isObjectLike(parser.parserOpts.parserOpts)
		) {
			parser.parserOpts = parser.parserOpts.parserOpts;
		}
		return parser;
	}

	// Create parser opts from factory
	if (
		isParserOptsFunction(parser) &&
		typeof parser.name === "string" &&
		parser.name.startsWith("conventional-changelog-")
	) {
		return new Promise((resolve) => {
			const result = parser.parserOpts((_: never, opts) => {
				resolve({
					...parser,
					parserOpts: opts?.parserOpts,
				});
			});

			// If result has data or a promise, the parser doesn't support factory-init
			// due to https://github.com/nodejs/promises-debugging/issues/16 it just quits, so let's use this fallback
			if (result) {
				Promise.resolve(result).then((opts) => {
					resolve({
						...parser,
						parserOpts: opts?.parserOpts || opts?.parser,
					});
				});
			}
			return;
		});
	}

	return parser;
}
