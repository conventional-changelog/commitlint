import {maxLength} from '@commitlint/ensure';
import {Rule} from './types';

export const headerMaxLength: Rule<number> = (
	parsed,
	_when = undefined,
	value = 0
) => {
	return [
		maxLength(parsed.header, value),
		`header must not be longer than ${value} characters, current length is ${
			parsed.header.length
		}`
	];
};
