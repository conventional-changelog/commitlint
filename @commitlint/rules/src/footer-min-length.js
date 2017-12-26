import {minLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	if (!parsed.footer) {
		return [true];
	}
	return [
		minLength(parsed.footer, value),
		`footer must not be shorter than ${value} characters`
	];
};
