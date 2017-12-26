import {maxLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	const input = parsed.body;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`body must not be longer than ${value} characters`
	];
};
