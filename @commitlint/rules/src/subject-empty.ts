import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';
import {SyncRule} from '@commitlint/types';

export const subjectEmpty: SyncRule = (parsed, when = 'always') => {
	const negated = when === 'never';
	const notEmpty = ensure.notEmpty(parsed.subject || '');

	return [
		negated ? notEmpty : !notEmpty,
		message(['subject', negated ? 'may not' : 'must', 'be empty']),
	];
};
