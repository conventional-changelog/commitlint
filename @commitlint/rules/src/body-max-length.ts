import {maxLength} from '@commitlint/ensure';
import {SyncRule} from '@commitlint/types';

export const bodyMaxLength: SyncRule<number> = (
	parsed,
	_when = undefined,
	value = 0
) => {
	const input = parsed.body;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`body must not be longer than ${value} characters`,
	];
};
