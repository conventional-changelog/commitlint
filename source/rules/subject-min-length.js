import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	const input = parsed.subject;
	if (!input) {
		return [true];
	}
	return [
		ensureMinLength(input, value),
		`subject must not be shorter than ${value} characters`
	];
};
