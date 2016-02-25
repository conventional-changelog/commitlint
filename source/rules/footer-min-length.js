import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	return [
		ensureMinLength(parsed.footer, value),
		`footer must not be shorter than ${value} characters`
	];
};
