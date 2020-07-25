import {Commit, Parser, ParserOptions} from '@commitlint/types';

const {sync} = require('conventional-commits-parser');
const defaultChangelogOpts = require('conventional-changelog-angular');

export default async function parse(
	message: string,
	parser: Parser = sync,
	parserOpts?: ParserOptions
): Promise<Commit> {
	const defaultOpts = (await defaultChangelogOpts).parserOpts;
	const opts = {
		...defaultOpts,
		...(parserOpts || {}),
	};
	const parsed = parser(message, opts) as Commit;
	parsed.raw = message;
	return parsed;
}
