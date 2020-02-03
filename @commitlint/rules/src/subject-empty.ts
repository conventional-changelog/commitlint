import * as ensure from '@commitlint/ensure';
import message from '@commitlint/message';
import {Rule} from './types';

export const subjectEmpty: Rule = (parsed, when = 'always') => {
	const negated = when === 'never';
	const notEmpty = ensure.notEmpty(parsed.subject || '');

	return [
		negated ? notEmpty : !notEmpty,
		message(['subject', negated ? 'may not' : 'must', 'be empty'])
	];
};
