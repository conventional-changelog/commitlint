import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	const input = parsed.type;

	if (!input) {
		return [true];
	}

	return [
		ensureMaxLength(input, value),
		`type must not be longer than ${value} characters`
	];
};
