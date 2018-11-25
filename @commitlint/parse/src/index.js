import {sync} from 'conventional-commits-parser';
import defaultChangelogOpts from 'conventional-changelog-angular';
import {merge} from 'lodash';

export default parse;

async function parse(message, parser = sync, parserOpts) {
	const defaultOpts = (await defaultChangelogOpts).parserOpts;
	const parsed = parser(message, merge({}, defaultOpts, parserOpts));
	parsed.raw = message;
	return parsed;
}
