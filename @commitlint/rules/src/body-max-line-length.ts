import {maxLineLength} from '@commitlint/ensure';
import {Rule} from './types';

export const bodyMaxLineLength: Rule<number> = (
	parsed,
	when = undefined,
	value = 0
) => {
	const input = parsed.body;

	if (!input) {
		return [true];
	}

	return [
		maxLineLength(input, value),
		`body's lines must not be longer than ${value} characters`
	];
};
