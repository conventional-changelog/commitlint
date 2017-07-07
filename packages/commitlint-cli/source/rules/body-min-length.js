import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	if (!parsed.body) {
		return [true];
	}

	return [
		ensureMinLength(parsed.body, value),
		`body must not be shorter than ${value} characters`
	];
};
