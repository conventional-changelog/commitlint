import type {Parser} from '@commitlint/types';

import {type Commit, type Options, sync} from 'conventional-commits-parser';
// @ts-expect-error -- no typings
import defaultChangelogOpts from 'conventional-changelog-angular';

export async function parse(
	message: string,
	parser: Parser = sync,
	parserOpts?: Options
): Promise<Commit> {
	const preset = await defaultChangelogOpts();
	const defaultOpts = preset.parserOpts;
	const opts = {
		...defaultOpts,
		fieldPattern: null,
		...(parserOpts || {}),
	};
	const parsed = parser(message, opts) as Commit;
	parsed.raw = message;
	return parsed;
}

export default parse;
