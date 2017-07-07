import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	const input = parsed.scope;
	if (!input) {
		return [true];
	}
	return [
		ensureMinLength(input, value),
		`scope must not be shorter than ${value} characters`
	];
};
