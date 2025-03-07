import {minLength} from '@commitlint/ensure';
import {SyncRule} from '@commitlint/types';

export const typeMinLength: SyncRule<number> = (
	parsed,
	_when = undefined,
	value = 0,
) => {
	const input = parsed.type;
	if (!input) {
		return [true];
	}
	return [
		minLength(input, value),
		`type must not be shorter than ${value} characters`,
	];
};
