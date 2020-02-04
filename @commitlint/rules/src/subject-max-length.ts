import {maxLength} from '@commitlint/ensure';
import {Rule} from './types';

export const subjectMaxLength: Rule<number> = (
	parsed,
	_when = undefined,
	value = 0
) => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`subject must not be longer than ${value} characters`
	];
};
