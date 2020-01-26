import {minLength} from '@commitlint/ensure';
import {Rule} from './types';

export const bodyMinLength: Rule<number> = (
	parsed,
	when = undefined,
	value = 0
) => {
	if (!parsed.body) {
		return [true];
	}

	return [
		minLength(parsed.body, value),
		`body must not be shorter than ${value} characters`
	];
};
