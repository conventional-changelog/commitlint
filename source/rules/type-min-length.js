import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	const input = parsed.type;
	if (!input) {
		return [true];
	}
	return [
		ensureMinLength(input, value),
		`type must not be shorter than ${value} characters`
	];
};
