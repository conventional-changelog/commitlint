import {minLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	return [
		minLength(parsed.header, value),
		`header must not be shorter than ${value} characters, current length is ${
			parsed.header.length
		}`
	];
};
