import importFrom from 'import-from';
import {sync} from 'conventional-commits-parser';
import opts from 'conventional-changelog-angular';

export default parse;

async function parse(message, parser = sync, parserPreset) {
	let presetOpts = await opts;

	if (parserPreset) {
		presetOpts = await importFrom(process.cwd(), parserPreset);
	}

	const parsed = parser(message, presetOpts.parserOpts);
	parsed.raw = message;
	return parsed;
}
