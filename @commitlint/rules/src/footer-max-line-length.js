import {maxLineLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	const input = parsed.footer;

	if (!input) {
		return [true];
	}

	return [
		maxLineLength(input, value),
		`footer's lines must not be longer than ${value} characters`
	];
};
