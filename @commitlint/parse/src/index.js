import {sync} from 'conventional-commits-parser';
import defaultChangelogOpts from 'conventional-changelog-angular';
import {isArray, mergeWith} from 'lodash';

export default parse;

async function parse(message, parser = sync, parserOpts = undefined) {
	const defaultOpts = (await defaultChangelogOpts).parserOpts;
	const parsed = parser(
		message,
		mergeWith({}, defaultOpts, parserOpts, (objValue, srcValue) => {
			if (isArray(objValue)) return srcValue;
		})
	);
	parsed.raw = message;
	return parsed;
}
