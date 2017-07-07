import {sync} from 'conventional-commits-parser';

export default parse;

function parse(message, options, parser = sync) {
	const parsed = parser(message, options);
	parsed.raw = message;
	return parsed;
}
