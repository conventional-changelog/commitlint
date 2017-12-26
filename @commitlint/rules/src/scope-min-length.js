import {minLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	const input = parsed.scope;
	if (!input) {
		return [true];
	}
	return [
		minLength(input, value),
		`scope must not be shorter than ${value} characters`
	];
};
