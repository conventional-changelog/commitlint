import {startsWith} from 'lodash';

export async function loadParserOpts(
	parserName: string,
	pendingParser: Promise<any>
) {
	// Await for the module, loaded with require
	const parser = await pendingParser;

	// Await parser opts if applicable
	if (
		typeof parser === 'object' &&
		typeof parser.parserOpts === 'object' &&
		typeof parser.parserOpts.then === 'function'
	) {
		return (await parser.parserOpts).parserOpts;
	}

	// Create parser opts from factory
	if (
		typeof parser === 'object' &&
		typeof parser.parserOpts === 'function' &&
		startsWith(parserName, 'conventional-changelog-')
	) {
		return await new Promise(resolve => {
			const result = parser.parserOpts((_: never, opts: {parserOpts: any}) => {
				resolve(opts.parserOpts);
			});

			// If result has data or a promise, the parser doesn't support factory-init
			// due to https://github.com/nodejs/promises-debugging/issues/16 it just quits, so let's use this fallback
			if (result) {
				Promise.resolve(result).then(opts => {
					resolve(opts.parserOpts);
				});
			}
		});
	}

	// Pull nested paserOpts, might happen if overwritten with a module in main config
	if (
		typeof parser === 'object' &&
		typeof parser.parserOpts === 'object' &&
		typeof parser.parserOpts.parserOpts === 'object'
	) {
		return parser.parserOpts.parserOpts;
	}

	return parser.parserOpts;
}
