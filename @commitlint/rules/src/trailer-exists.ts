import {spawnSync} from 'child_process';
import message from '@commitlint/message';
import toLines from '@commitlint/to-lines';
import {SyncRule} from '@commitlint/types';

export const trailerExists: SyncRule<string> = (
	parsed,
	when = 'always',
	value = ''
) => {
	const trailers = spawnSync('git', ['interpret-trailers', '--parse'], {
		input: parsed.raw || '',
	}).stdout;

	const matches = toLines(trailers.toString()).filter((ln) =>
		ln.startsWith(value)
	).length;

	const negated = when === 'never';
	const hasTrailer = matches > 0;

	return [
		negated ? !hasTrailer : hasTrailer,
		message([
			'message',
			negated ? 'must not' : 'must',
			'have `' + value + '` trailer',
		]),
	];
};
