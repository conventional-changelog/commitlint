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
const asciiTypeCapture = "^(\\w*)";
const unicodeTypeCapture = "^([\\p{L}\\p{N}_]*)";

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
	for (const key of ["headerPattern", "breakingHeaderPattern"] as const) {
		if (opts[key]) {
			opts[key] = widenTypeCapture(opts[key]) as RegExp;
		}
	}
	const parsed = parser(message, opts) as Commit;
	parsed.raw = message;
	return parsed;
}

export default parse;
