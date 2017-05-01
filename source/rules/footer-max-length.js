import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	if (!parsed.footer) {
		return [true];
	}

	return [
		ensureMaxLength(parsed.footer, value),
		`footer must not be longer than ${value} characters`
	];
};
