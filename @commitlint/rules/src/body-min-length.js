import {minLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	if (!parsed.body) {
		return [true];
	}

	return [
		minLength(parsed.body, value),
		`body must not be shorter than ${value} characters`
	];
};
