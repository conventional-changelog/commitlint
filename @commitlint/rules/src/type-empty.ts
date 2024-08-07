import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';
import {SyncRule} from '@commitlint/types';

export const typeEmpty: SyncRule = (parsed, when = 'always') => {
	const negated = when === 'never';
	const notEmptyType = ensure.notEmpty(parsed.type || '');
	let notEmpty = notEmptyType;
	if (
		!notEmptyType &&
		parsed.subject !== parsed.header &&
		parsed.header.substring(0, 1) === ':'
	)
		notEmpty = true;
	return [
		negated ? notEmpty : !notEmpty,
		message(['type', negated ? 'may not' : 'must', 'be empty']),
	];
};
