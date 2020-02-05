import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';
import {Commit, Parser, ParserOptions} from './types';

const {sync} = require('conventional-commits-parser');
const defaultChangelogOpts = require('conventional-changelog-angular');

export default parse;
export * from './types';

async function parse(
	message: string,
	parser: Parser = sync,
	parserOpts?: ParserOptions
): Promise<Commit> {
	const defaultOpts = (await defaultChangelogOpts).parserOpts;
	const opts = mergeWith({}, defaultOpts, parserOpts, (objValue, srcValue) => {
		if (isArray(objValue)) return srcValue;
	});
	const parsed = parser(message, opts) as Commit;
	parsed.raw = message;
	return parsed;
}
