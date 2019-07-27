import {isArray, mergeWith} from 'lodash';

const {sync} = require('conventional-commits-parser');
const defaultChangelogOpts = require('conventional-changelog-angular');

export default parse;

async function parse(
	message?: any,
	parser: any = sync,
	parserOpts: any = undefined
) {
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
