import ensureMinLength from '../library/ensure-min-length';

export default (parsed, when, value) => {
	return [
		ensureMinLength(parsed.header, value),
		`scope must not be shorter than ${value} characters`
	];
};
