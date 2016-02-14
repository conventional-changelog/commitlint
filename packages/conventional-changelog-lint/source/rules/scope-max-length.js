import ensureMaxLength from '../library/ensure-max-length';

export default (parsed, when, value) => {
	return [
		ensureMaxLength(parsed.subject, value),
		`scope must not be longer than ${value} characters`
	];
};
