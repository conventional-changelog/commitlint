import {minLength} from '@commitlint/ensure';
import {Rule} from '@commitlint/types';

export const scopeMinLength: Rule<number> = (
	parsed,
	_when = undefined,
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
