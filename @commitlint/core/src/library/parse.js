import {sync} from 'conventional-commits-parser';

export default parse;

async function parse(message, parser = sync) {
	// Prevent conventional-changelog-angular from spamming startup
	// TODO: Remove when https://github.com/conventional-changelog/conventional-changelog/pull/206 lands
	const _error = console.error;
	console.error = () => {};
	const opts = require('conventional-changelog-angular');
	console.error = _error;

	const {parserOpts} = await opts;
	const parsed = parser(message, parserOpts);
	parsed.raw = message;
	return parsed;
}
