import message from '@commitlint/message';
import {SyncRule} from '@commitlint/types';

export const referencesEmpty: SyncRule = (parsed, when = 'never') => {
	const negated = when === 'always';
	const notEmpty = parsed.references.length > 0;
	return [
		negated ? !notEmpty : notEmpty,
		message(['references', negated ? 'must' : 'may not', 'be empty']),
	];
};
