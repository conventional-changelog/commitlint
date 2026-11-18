import type { Parser } from "@commitlint/types";

import { type Commit, type ParserOptions, CommitParser } from "conventional-commits-parser";
import defaultChangelogOpts from "conventional-changelog-angular";

const defaultParser: Parser = (message, options) => {
	if (message === undefined || message === null) {
		throw new TypeError("Expected a raw commit");
	}
	const parser = new CommitParser(options);
	const result = parser.parse(message);
	result.scope = result.scope ?? null;
	result.subject = result.subject ?? null;
	result.type = result.type ?? null;
	return result;
};

// The presets capture the type of a header with `(\w*)`, which only matches ASCII word
// characters. Types in other scripts, e.g. `功能: 新增登录`, would be left without a type.
const hasNonAscii = /\P{ASCII}/u;
const asciiTypeCapture = "^(\\w*)";
const unicodeTypeCapture = "^([\\p{L}\\p{M}\\p{N}_]*)";

function widenTypeCapture(pattern: unknown): unknown {
	if (
		!(pattern instanceof RegExp) ||
		/[uv]/.test(pattern.flags) ||
		!pattern.source.startsWith(asciiTypeCapture)
	) {
		return pattern;
	}

	try {
		return new RegExp(
			unicodeTypeCapture + pattern.source.slice(asciiTypeCapture.length),
			pattern.flags + "u",
		);
	} catch {
		// the rest of the pattern is not valid in unicode mode
		return pattern;
	}
}

function widenTypeCaptures<T extends Record<string, any>>(opts: T): T | null {
	const widened: Record<string, any> = { ...opts };
	let changed = false;
	for (const key of ["headerPattern", "breakingHeaderPattern"]) {
		const pattern = widenTypeCapture(opts[key]);
		if (pattern !== opts[key]) {
			widened[key] = pattern;
			changed = true;
		}
	}
	return changed ? (widened as T) : null;
}

export async function parse(
	message: string,
	parser: Parser = defaultParser,
	parserOpts?: ParserOptions,
): Promise<Commit> {
	// conventional-changelog-angular@>=9 ships typings that declare the preset as
	// `{}`; the parser options live under `.parser` at runtime.
	const preset = (await defaultChangelogOpts()) as {
		parser?: ParserOptions;
		parserOpts?: ParserOptions;
	};
	const defaultOpts = preset.parser || preset.parserOpts;
	// Support user-provided parser options passed either flat or nested under a 'parser' key
	const userOpts = (parserOpts as any)?.parser || parserOpts || {};
	const opts = {
		...defaultOpts,
		fieldPattern: null,
		...userOpts,
	};
	let parsed = parser(message, opts) as Commit;
	// Adding the `u` flag changes how the whole pattern reads, so the widened patterns
	// are only a second try for non-ASCII headers that got no type from the original ones.
	if (parsed.type == null && hasNonAscii.test(message)) {
		const widened = widenTypeCaptures(opts);
		if (widened) {
			const retried = parser(message, widened) as Commit;
			if (retried.type != null) {
				parsed = retried;
			}
		}
	}
	parsed.raw = message;
	return parsed;
}

export default parse;
