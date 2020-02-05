import {maxLength} from '@commitlint/ensure';
import {Rule} from '@commitlint/types';

export const typeMaxLength: Rule<number> = (
	parsed,
	_when = undefined,
	value = 0
) => {
	const input = parsed.type;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`type must not be longer than ${value} characters`
	];
};
