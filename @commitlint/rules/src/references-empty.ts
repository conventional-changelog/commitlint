import message from '@commitlint/message';
import {Rule} from './types';

export const referencesEmpty: Rule = (parsed, when = 'never') => {
	const negated = when === 'always';
	const notEmpty = parsed.references.length > 0;
	return [
		negated ? !notEmpty : notEmpty,
		message(['references', negated ? 'must' : 'may not', 'be empty'])
	];
};
