import {minLength} from '@commitlint/ensure';
import {Rule} from './types';

export const footerMinLength: Rule<number> = (
	parsed,
	when = undefined,
	value = 0
) => {
	if (!parsed.footer) {
		return [true];
	}

	return [
		minLength(parsed.footer, value),
		`footer must not be shorter than ${value} characters`
	];
};
