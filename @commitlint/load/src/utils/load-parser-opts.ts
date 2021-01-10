import {ParserPreset} from '@commitlint/types';
import {isObjectLike, isParserOptsFunction, isPromiseLike} from './validators';

export async function loadParser(
	pendingParser: unknown
): Promise<ParserPreset | undefined> {
	if (!pendingParser) {
		return undefined;
	}
	// Await for the module, loaded with require
	const parser = await pendingParser;

	if (!isObjectLike(parser)) {
		throw new Error('Invalid configuration, `parserPreset` must be an object');
	}

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
