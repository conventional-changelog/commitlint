import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	return [
		ensureMinLength(parsed.subject, value),
		`message must not be shorter than ${value} characters`
	];
};
