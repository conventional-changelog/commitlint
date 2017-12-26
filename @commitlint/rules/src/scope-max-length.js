import {maxLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	const input = parsed.scope;

	if (!input) {
		return [true];
	}

	return [
		maxLength(input, value),
		`scope must not be longer than ${value} characters`
	];
};
