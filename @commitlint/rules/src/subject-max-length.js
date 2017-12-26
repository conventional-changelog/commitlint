import {maxLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	const input = parsed.subject;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`footer must not be longer than ${value} characters`
	];
};
