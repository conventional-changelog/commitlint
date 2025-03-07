import {maxLength} from '@commitlint/ensure';
import {SyncRule} from '@commitlint/types';

export const subjectMaxLength: SyncRule<number> = (
	parsed,
	_when = undefined,
	value = 0,
) => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`subject must not be longer than ${value} characters`,
	];
};
