import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';
import {SyncRule} from '@commitlint/types';

export const bodyEmpty: SyncRule = (parsed, when = 'always') => {
	const negated = when === 'never';
	const notEmpty = ensure.notEmpty(parsed.body || '');

	return [
		negated ? notEmpty : !notEmpty,
		message(['body', negated ? 'may not' : 'must', 'be empty']),
	];
};
