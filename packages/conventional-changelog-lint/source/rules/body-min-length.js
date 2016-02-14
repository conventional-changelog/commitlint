import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	return [
		ensureMinLength(parsed.body, value),
		`body must not be shorter than ${value} characters`
	];
};
