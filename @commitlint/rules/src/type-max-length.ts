import {maxLength} from '@commitlint/ensure';
import {SyncRule} from '@commitlint/types';

export const typeMaxLength: SyncRule<number> = (
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
		`type must not be longer than ${value} characters`,
	];
};
