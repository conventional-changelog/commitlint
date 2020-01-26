import {minLength} from '@commitlint/ensure';
import {Rule} from './types';

export const scopeMinLength: Rule<number> = (
	parsed,
	when = undefined,
	value = 0
) => {
	const input = parsed.scope;
	if (!input) {
		return [true];
	}
	return [
		minLength(input, value),
		`scope must not be shorter than ${value} characters`
	];
};
