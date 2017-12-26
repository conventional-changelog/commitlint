import {minLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	const input = parsed.subject;
	if (!input) {
		return [true];
	}
	return [
		minLength(input, value),
		`subject must not be shorter than ${value} characters`
	];
};
