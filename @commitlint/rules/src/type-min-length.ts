import {minLength} from '@commitlint/ensure';
import {Rule} from './types';

export const typeMinLength: Rule<number> = (
	parsed,
	when = undefined,
	value = 0
) => {
	const input = parsed.type;
	if (!input) {
		return [true];
	}
	return [
		minLength(input, value),
		`type must not be shorter than ${value} characters`
	];
};
