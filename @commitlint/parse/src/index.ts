import type { Parser } from "@commitlint/types";

import {
	type Commit,
	type ParserOptions,
	CommitParser,
} from "conventional-commits-parser";
// @ts-expect-error -- no typings
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

export async function parse(
	message: string,
	parser: Parser = defaultParser,
	parserOpts?: ParserOptions,
): Promise<Commit> {
	const preset = await defaultChangelogOpts();
	const defaultOpts = preset.parser || preset.parserOpts;
	// Support user-provided parser options passed either flat or nested under a 'parser' key
	const userOpts = (parserOpts as any)?.parser || parserOpts || {};
	const opts = {
		...defaultOpts,
		fieldPattern: null,
		...userOpts,
	};
	const parsed = parser(message, opts) as Commit;
	parsed.raw = message;
	return parsed;
}

export default parse;
