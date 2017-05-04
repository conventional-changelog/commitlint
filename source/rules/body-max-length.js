import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	if (!parsed.body) {
		return [true];
	}

	return [
		ensureMaxLength(parsed.body, value),
		`body must not be longer than ${value} characters`
	];
};
