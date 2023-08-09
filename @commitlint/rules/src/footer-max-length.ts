import {maxLength} from '@commitlint/ensure';
import {SyncRule} from '@commitlint/types';

export const footerMaxLength: SyncRule<number> = (
	parsed,
	_when = undefined,
	value = 0
) => {
	const input = parsed.footer;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`footer must not be longer than ${value} characters`,
	];
};
