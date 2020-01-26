import {maxLength} from '@commitlint/ensure';
import {Rule} from './types';

export const scopeMaxLength: Rule<number> = (
	parsed,
	when = undefined,
	value = 0
) => {
	const input = parsed.scope;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`scope must not be longer than ${value} characters`
	];
};
