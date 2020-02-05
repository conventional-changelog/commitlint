import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';
import {Rule} from '@commitlint/types';

export const scopeEmpty: Rule = (parsed, when = 'never') => {
	const negated = when === 'always';
	const notEmpty = ensure.notEmpty(parsed.scope || '');
	return [
		negated ? !notEmpty : notEmpty,
		message(['scope', negated ? 'must' : 'may not', 'be empty'])
	];
};
