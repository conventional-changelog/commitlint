import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	return [
		ensureMaxLength(parsed.header, value),
		`header must not be longer than ${value} characters`
	];
};
