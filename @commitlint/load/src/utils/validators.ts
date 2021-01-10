import {Plugin, RulesConfig} from '@commitlint/types';

export function isObjectLike(obj: unknown): obj is Record<string, unknown> {
	return Boolean(obj) && typeof obj === 'object'; // typeof null === 'object'
}

export function isPromiseLike(obj: unknown): obj is Promise<unknown> {
	return (
		(typeof obj === 'object' || typeof obj === 'function') &&
		typeof (obj as any).then === 'function'
	);
}

export function isParserOptsFunction<T extends Record<string, unknown>>(
	obj: T
): obj is T & {
	parserOpts: (
		cb: (_: never, parserOpts: Record<string, unknown>) => unknown
	) => Record<string, unknown> | undefined;
} {
	return typeof obj.parserOpts === 'function';
}

export function validateConfig(
	config: Record<string, unknown>
): asserts config is {
	formatter: string;
	ignores?: ((commit: string) => boolean)[];
	defaultIgnores?: boolean;
	plugins?: (Plugin | string)[];
	rules: Partial<RulesConfig>;
	helpUrl: string;
	[key: string]: unknown;
} {
	if (!isObjectLike(config)) {
		throw new Error('Invalid configuration, `parserPreset` must be an object');
	}
	if (typeof config.formatter !== 'string') {
		throw new Error('Invalid configuration, `formatter` must be a string');
	}
	if (config.ignores && !Array.isArray(config.ignores)) {
		throw new Error('Invalid configuration, `ignores` must ba an array');
	}
	if (config.plugins && !Array.isArray(config.plugins)) {
		throw new Error('Invalid configuration, `plugins` must ba an array');
	}
	if (
		typeof config.defaultIgnores !== 'boolean' &&
		typeof config.defaultIgnores !== 'undefined'
	) {
		throw new Error(
			'Invalid configuration, `defaultIgnores` must ba true/false'
		);
	}
	if (typeof config.helpUrl !== 'string') {
		throw new Error('Invalid configuration, `helpUrl` must be a string');
	}
}

export function validateParser(
	parser: unknown
): asserts parser is {name: string; path: string; [key: string]: unknown} {
	if (!isObjectLike(parser)) {
		throw new Error('Invalid configuration, parserPreset must be an object');
	}
	if (typeof parser.name !== 'string') {
		throw new Error('Invalid configuration, parserPreset must have a name');
	}
	if (typeof parser.path !== 'string') {
		throw new Error('Invalid configuration, parserPreset must have a name');
	}
}
