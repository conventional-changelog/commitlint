import {sync} from 'conventional-commits-parser';
import defaultChangelogOpts from 'conventional-changelog-angular';

export default parse;

async function parse(message, parser = sync, parserOpts) {
	if (!parserOpts) {
		const changelogOpts = await defaultChangelogOpts;
		parserOpts = changelogOpts.parserOpts;
	}

	const parsed = parser(message, parserOpts);
	parsed.raw = message;
	return parsed;
}
