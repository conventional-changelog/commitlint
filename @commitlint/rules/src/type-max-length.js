import {maxLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	const input = parsed.type;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`type must not be longer than ${value} characters`
	];
};
