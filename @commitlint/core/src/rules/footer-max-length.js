import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	const input = parsed.footer;

	if (!input) {
		return [true];
	}

	return [
		ensureMaxLength(input, value),
		`footer must not be longer than ${value} characters`
	];
};
