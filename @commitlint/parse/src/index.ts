import {
	type Commit,
	type ParserOptions,
	CommitParser,
} from 'conventional-commits-parser';
import type {Parser} from '@commitlint/types';

// @ts-expect-error -- no typings
import defaultChangelogOpts from 'conventional-changelog-angular';

export async function parse(
	message: string,
	parser?: Parser,
	parserOpts?: ParserOptions
): Promise<Commit> {
	const preset = await defaultChangelogOpts();
	const defaultOpts = preset.parserOpts;
	const opts = {
		...defaultOpts,
		fieldPattern: null,
		...(parserOpts || {}),
	};

	let parsed;

	if (parser) {
		parsed = parser(message, opts) as Commit;
	} else {
		const defaultParser = new CommitParser(opts);
		parsed = defaultParser.parse(message) as Commit;
	}

	parsed.raw = message;
	return parsed;
}

export default parse;
