import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	const input = parsed.scope;

	if (!input) {
		return [true];
	}

	return [
		ensureMaxLength(input, value),
		`scope must not be longer than ${value} characters`
	];
};
