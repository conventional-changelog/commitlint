import {minLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	const input = parsed.type;
	if (!input) {
		return [true];
	}
	return [
		minLength(input, value),
		`type must not be shorter than ${value} characters`
	];
};
