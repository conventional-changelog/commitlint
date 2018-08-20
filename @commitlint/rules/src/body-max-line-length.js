import {maxLineLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	const input = parsed.body;

	if (!input) {
		return [true];
	}

	return [
		maxLineLength(input, value),
		`body's lines must not be longer than ${value} characters`
	];
};
