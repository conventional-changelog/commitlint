import execa from 'execa';
import message from '@commitlint/message';
import toLines from '@commitlint/to-lines';
import {SyncRule} from '@commitlint/types';

export const signedOffBy: SyncRule<string> = (
	parsed,
	when = 'always',
	value = ''
) => {
	const trailers = execa.sync('git', ['interpret-trailers', '--parse'], {
		input: parsed.raw,
	}).stdout;

	const signoffs = toLines(trailers).filter((ln) => ln.startsWith(value))
		.length;

	const negated = when === 'never';
	const hasSignedOffBy = signoffs > 0;

	return [
		negated ? !hasSignedOffBy : hasSignedOffBy,
		message(['message', negated ? 'must not' : 'must', 'be signed off']),
	];
};
