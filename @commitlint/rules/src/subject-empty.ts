import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';
import {SyncRule} from '@commitlint/types';

export const subjectEmpty: SyncRule<string[]> = (
	parsed,
	when = 'always',
	types = []
) => {
	const {type: input, subject} = parsed;

	const negated = when === 'never';
	const notEmpty = ensure.notEmpty(subject || '');

	let result = negated ? notEmpty : !notEmpty;
	if (input && types?.length && !ensure.enum(input, types)) {
		result = true;
	}

	return [
		result,
		message(['subject', negated ? 'may not' : 'must', 'be empty']),
	];
};
