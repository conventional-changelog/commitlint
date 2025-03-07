import {minLength} from '@commitlint/ensure';
import {SyncRule} from '@commitlint/types';

export const subjectMinLength: SyncRule<number> = (
	parsed,
	_when = undefined,
	value = 0,
) => {
	const input = parsed.subject;
	if (!input) {
		return [true];
	}
	return [
		minLength(input, value),
		`subject must not be shorter than ${value} characters`,
	];
};
