import message from '@commitlint/message';
import toLines from '@commitlint/to-lines';
import {SyncRule} from '@commitlint/types';

export const signedOffBy: SyncRule<string> = (
	parsed,
	when = 'always',
	value = ''
) => {
	const lines = toLines(parsed.raw).filter(
		(ln) =>
			// skip comments
			!ln.startsWith('#') &&
			// ignore empty lines
			Boolean(ln)
	);

	const last = lines[lines.length - 1];

	const negated = when === 'never';
	const hasSignedOffBy =
		// empty commit message
		last ? last.startsWith(value) : false;

	return [
		negated ? !hasSignedOffBy : hasSignedOffBy,
		message(['message', negated ? 'must not' : 'must', 'be signed off']),
	];
};
