import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	if (!parsed.footer) {
		return [true];
	}
	return [
		ensureMinLength(parsed.footer, value),
		`footer must not be shorter than ${value} characters`
	];
};
