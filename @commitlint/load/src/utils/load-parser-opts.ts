import {ParserPreset} from '@commitlint/types';

function isObjectLike(obj: unknown): obj is Record<string, unknown> {
	return Boolean(obj) && typeof obj === 'object'; // typeof null === 'object'
}

function isPromiseLike(obj: unknown): obj is Promise<unknown> {
	return isObjectLike(obj) && typeof (obj as any).then === 'function';
}

function isParserOptsFunction<T extends ParserPreset>(
	obj: T
): obj is T & {
	parserOpts: (
		cb: (_: never, parserOpts: Record<string, unknown>) => unknown
	) => Record<string, unknown> | undefined;
} {
	return typeof obj.parserOpts === 'function';
}

export async function loadParserOpts(
	pendingParser: string | ParserPreset | Promise<ParserPreset> | undefined
): Promise<ParserPreset | undefined> {
	if (!pendingParser || typeof pendingParser !== 'object') {
		return undefined;
	}
	// Await for the module, loaded with require
	const parser = await pendingParser;

	// Await parser opts if applicable
	if (isPromiseLike(parser.parserOpts)) {
		parser.parserOpts = ((await parser.parserOpts) as any).parserOpts;
		return parser;
	}

	// Create parser opts from factory
	if (
		isParserOptsFunction(parser) &&
		typeof parser.name === 'string' &&
		parser.name.startsWith('conventional-changelog-')
	) {
		return new Promise((resolve) => {
			const result = parser.parserOpts((_: never, opts) => {
				resolve({
					...parser,
					parserOpts: opts.parserOpts,
				});
			});

			// If result has data or a promise, the parser doesn't support factory-init
			// due to https://github.com/nodejs/promises-debugging/issues/16 it just quits, so let's use this fallback
			if (result) {
				Promise.resolve(result).then((opts) => {
					resolve({
						...parser,
						parserOpts: opts.parserOpts,
					});
				});
			}
			return;
		});
	}

	// Pull nested parserOpts, might happen if overwritten with a module in main config
	if (
		isObjectLike(parser.parserOpts) &&
		typeof parser.parserOpts.parserOpts === 'object'
	) {
		parser.parserOpts = parser.parserOpts.parserOpts;
	}
	return parser;
}
