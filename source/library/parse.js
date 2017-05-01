import {sync} from 'conventional-commits-parser';

export default parse;

function parse(message, options) {
	const parsed = sync(message, options);
	parsed.raw = message;
	return parsed;
}
