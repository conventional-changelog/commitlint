import {maxLength} from '@commitlint/ensure';
import {Rule} from '@commitlint/types';

export const footerMaxLength: Rule<number> = (
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
		`footer must not be longer than ${value} characters`
	];
};
