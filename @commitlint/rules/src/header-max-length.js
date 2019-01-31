import {maxLength} from '@commitlint/ensure';

export default (parsed, when, value) => {
	return [
		maxLength(parsed.header, value),
		`header must not be longer than ${value} characters, current length is ${
			parsed.header.length
		}`
	];
};
