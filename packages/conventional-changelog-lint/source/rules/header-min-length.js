import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	return [
		ensureMinLength(parsed.header, value),
		`header must not be shorter than ${value} characters`
	];
};
